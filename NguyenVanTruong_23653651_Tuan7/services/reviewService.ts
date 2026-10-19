export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewInput {
  bookId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
}

const API_URL = 'http://localhost:3000';

export const reviewService = {
  async getReviews(bookId: string): Promise<Review[]> {
    const response = await fetch(
      `${API_URL}/reviews?bookId=${encodeURIComponent(bookId)}`
    );

    if (!response.ok) {
      throw new Error('Không thể tải danh sách đánh giá');
    }

    return (await response.json()) as Review[];
  },

  async createReview(
    input: CreateReviewInput
  ): Promise<Review> {
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...input,
        comment: input.comment.trim(),
        createdAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Gửi đánh giá thất bại');
    }

    return (await response.json()) as Review;
  },
};