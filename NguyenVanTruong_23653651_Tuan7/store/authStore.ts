
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

const AUTH_STORAGE_KEY = 'auth';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  hydrated: boolean;

  loginSuccess: (token: string, user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
  hydrateAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  hydrated: false,

  // Lưu phiên đăng nhập
  loginSuccess: async (token, user) => {
    await AsyncStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ token, user })
    );

    set({
      token,
      user,
      hydrated: true,
    });
  },

  // Đăng xuất và xóa phiên đăng nhập
  logout: async () => {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);

    set({
      token: null,
      user: null,
      hydrated: true,
    });
  },

  // Khôi phục phiên đăng nhập khi mở app
  hydrateAuth: async () => {
    try {
      const storedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

      if (!storedAuth) {
        set({
          token: null,
          user: null,
          hydrated: true,
        });
        return;
      }

      const parsedAuth = JSON.parse(storedAuth) as {
        token?: string;
        user?: AuthUser;
      };

      const validUser =
        parsedAuth.user &&
        typeof parsedAuth.user.id === 'string' &&
        typeof parsedAuth.user.email === 'string';

      if (
        typeof parsedAuth.token === 'string' &&
        parsedAuth.token.trim().length > 0 &&
        validUser
      ) {
        set({
          token: parsedAuth.token,
          user: parsedAuth.user!,
          hydrated: true,
        });
        return;
      }

      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);

      set({
        token: null,
        user: null,
        hydrated: true,
      });
    } catch {
      // Dữ liệu lưu bị lỗi hoặc không đọc được.
      try {
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        set({
          token: null,
          user: null,
          hydrated: true,
        });
      }
    }
  },
}));
