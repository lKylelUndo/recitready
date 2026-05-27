import { api } from "@/lib/api/axios"
import type { AuthUser } from "@/types/auth"
import type { LoginInput, RegisterInput } from "@/lib/validations/auth"

export type AuthResponse = {
  status: string
  message: string
  user?: AuthUser
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await api.get<{ user: AuthUser }>("/auth/me")
  return response.data.user
}

export async function loginUser(data: LoginInput): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", data)
  return response.data
}

export async function registerUser(
  data: Omit<RegisterInput, "confirmPassword">
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/register", data)
  return response.data
}

export async function logoutUser(): Promise<void> {
  await api.post("/auth/logout")
}
