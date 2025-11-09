export type ApiUser = {
  _id: string;
  email: string;
  username?: string;
  role?: string;
  profileImage?: string;
};

export type ApiSong = {
  _id: string;
  title: string;
  topic?: string;
  mood?: string;
  genre?: string;
  language?: string;
  style?: string;
  era?: string;
  verses?: string;
  creativity?: number;
  lyrics?: string;
  likeCount?: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string | ApiUser;
  prompt?: string | {
    _id: string;
  };
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type PromptHistoryItem = {
  _id: string;
  prompt: string;
  createdAt: string;
  song?: ApiSong & { title?: string };
};

export type PopularSong = {
  id: string;
  title: string;
  likeCount: number;
  mood: string;
  genre: string;
  createdAt: string;
  createdBy?: {
    id?: string;
    username?: string;
    email?: string;
  };
};

export type ApiComment = {
  _id: string;
  text: string;
  createdAt: string;
  user?: {
    _id?: string;
    username?: string;
    email?: string;
  };
};

