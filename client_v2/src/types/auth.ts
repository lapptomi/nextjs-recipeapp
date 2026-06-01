export interface AuthResponse {
  email: string;
  username: string;
  token: string;
  refreshToken: string;
  userId: number;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  image: string | null;
  bio: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
}
