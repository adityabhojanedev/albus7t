/**
 * types/auth.ts
 * Shared TypeScript interfaces for the auth flow.
 */

// ── Request bodies ────────────────────────────────────────────────────────────

export interface SignupBody {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  favoriteGames?: string[];
  platforms?: Array<"PC" | "Console" | "Mobile">;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface ResendBody {
  email: string;
}

// ── Generic API response wrapper ──────────────────────────────────────────────

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// ── JWT payload stored in the token ──────────────────────────────────────────

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  iat?: number;
  exp?: number;
}

// ── Safe user shape returned to the client (no password/token) ───────────────

export interface PublicUser {
  id: string;
  email: string;
  username: string;
  favoriteGames: string[];
  platforms: string[];
  verified: boolean;
  createdAt: string;
}
