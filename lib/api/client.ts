"use client";

import { auth } from "@/lib/firebase/config";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";

async function getAuthHeader(): Promise<Record<string, string>> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const headers = await getAuthHeader();
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }
  return res.json();
}

export async function apiGet<T>(path: string): Promise<T> {
  const headers = await getAuthHeader();
  const res = await fetch(`${BASE}${path}`, { headers });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}
