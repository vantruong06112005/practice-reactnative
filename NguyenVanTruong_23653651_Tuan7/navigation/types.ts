export type RootStackParamList = {
  Auth: {
    redirectTo?: 'BookDetail' | 'Checkout';
    bookId?: string;
  } | undefined;

  Home: undefined;

  BookDetail: {
    bookId: string;
    bookTitle?: string;
  };

  Cart: undefined;
  Checkout: undefined;
};