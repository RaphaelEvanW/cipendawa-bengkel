import api from "./axios";
import { ApiResponse, LoginResponse } from "../types";

export async function login(username: string, password: string): Promise<LoginResponse> {
  const res = await api.post<ApiResponse<LoginResponse>>("/auth/login", {
    username,
    password,
  });

  const { access_token, admin } = res.data.data;

  localStorage.setItem("access_token", access_token);
  localStorage.setItem("admin", JSON.stringify(admin));

  return res.data.data;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("admin");
  window.location.href = "/login";
}

export function getAdmin() {
  if (typeof window === "undefined") return null;
  const admin = localStorage.getItem("admin");
  return admin ? JSON.parse(admin) : null;
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("access_token");
}