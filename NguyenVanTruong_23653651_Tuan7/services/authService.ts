
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

const API_BASE_URLS = Array.from(
  new Set([
    (typeof process !== 'undefined' &&
      process.env.EXPO_PUBLIC_API_URL) ||
      '',
    'http://0.0.0.0:3000/users',
    'http://0.0.0.0:3000/books',
    'http://0.0.0.0:3000/reviews',
  ].filter(Boolean) as string[])
);

let apiBaseUrlPromise: Promise<string> | null = null;

type StoredUser = User & {
  password: string;
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new Error('Không thể kết nối tới JSON Server');
  }

  return (await response.json()) as T;
}

async function resolveApiBaseUrl(): Promise<string> {
  if (!apiBaseUrlPromise) {
    apiBaseUrlPromise = (async () => {
      for (const baseUrl of API_BASE_URLS) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 1200);

          const response = await fetch(`${baseUrl}/users?_limit=1`, {
            signal: controller.signal,
          });

          clearTimeout(timeout);

          if (response.ok) {
            return baseUrl;
          }
        } catch {
          // Try the next candidate base URL.
        }
      }

      throw new Error(
        'Không thể kết nối tới JSON Server. Hãy kiểm tra cổng hoặc EXPO_PUBLIC_API_URL.'
      );
    })();
  }

  return apiBaseUrlPromise;
}

async function readUsers(): Promise<StoredUser[]> {
  const baseUrl = await resolveApiBaseUrl();
  return fetchJson<StoredUser[]>(`${baseUrl}/users`);
}

async function createUser(
  email: string,
  password: string
): Promise<User> {
  const existingUsers = await readUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (
    existingUsers.some(
      (user) => user.email.toLowerCase() === normalizedEmail
    )
  ) {
    throw new Error('Email đã tồn tại');
  }

  const baseUrl = await resolveApiBaseUrl();

  const createdUser = await fetchJson<StoredUser>(`${baseUrl}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: String(Date.now()),
      name: normalizedEmail.split('@')[0],
      email: normalizedEmail,
      password,
    }),
  });
  const { password: _password, ...user } = createdUser;

  return user;
}

export const authService = {
  async login(
    email: string,
    password: string
  ): Promise<AuthResponse> {
    const normalizedEmail = email.trim().toLowerCase();
    const users = await readUsers();

    const matchedUser = users.find(
      (user) =>
        user.email.toLowerCase() === normalizedEmail &&
        user.password === password
    );

    if (!matchedUser) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }

    const { password: _password, ...user } = matchedUser;

    return {
      token: `token-${user.id}`,
      user,
    };
  },

  async register(
    email: string,
    password: string
  ): Promise<{ message: string }> {
    await createUser(email, password);

    return {
      message: 'Đăng ký thành công',
    };
  },
};
