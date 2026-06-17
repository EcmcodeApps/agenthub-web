"use client";

/**
 * Cliente Firestore via REST API — evita problemas de inicialización del SDK en Next.js 15.
 * Usa el token de Firebase Auth para autenticación.
 */

const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

async function getToken(): Promise<string> {
  const { auth } = await import("@/lib/firebase/config");
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("No auth token");
  return token;
}

function toFirestoreValue(val: unknown): object {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === "string") return { stringValue: val };
  if (typeof val === "number") return { integerValue: String(val) };
  if (typeof val === "boolean") return { booleanValue: val };
  if (val instanceof Date) return { timestampValue: val.toISOString() };
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } };
  }
  if (typeof val === "object") {
    return {
      mapValue: {
        fields: Object.fromEntries(
          Object.entries(val as Record<string, unknown>)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => [k, toFirestoreValue(v)])
        ),
      },
    };
  }
  return { stringValue: String(val) };
}

function fromFirestoreValue(val: Record<string, unknown>): unknown {
  if ("stringValue" in val) return val.stringValue;
  if ("integerValue" in val) return Number(val.integerValue);
  if ("doubleValue" in val) return Number(val.doubleValue);
  if ("booleanValue" in val) return val.booleanValue;
  if ("nullValue" in val) return null;
  if ("timestampValue" in val) return new Date(val.timestampValue as string);
  if ("arrayValue" in val) {
    const items = (val.arrayValue as { values?: unknown[] }).values ?? [];
    return items.map((v) => fromFirestoreValue(v as Record<string, unknown>));
  }
  if ("mapValue" in val) {
    const fields = (val.mapValue as { fields?: Record<string, unknown> }).fields ?? {};
    return Object.fromEntries(
      Object.entries(fields).map(([k, v]) => [k, fromFirestoreValue(v as Record<string, unknown>)])
    );
  }
  return null;
}

export async function fsGet(collection: string, id: string): Promise<Record<string, unknown> | null> {
  const token = await getToken();
  const res = await fetch(`${BASE}/${collection}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Firestore GET error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  const fields = data.fields ?? {};
  return Object.fromEntries(
    Object.entries(fields).map(([k, v]) => [k, fromFirestoreValue(v as Record<string, unknown>)])
  );
}

export async function fsSet(collection: string, id: string, data: Record<string, unknown>): Promise<void> {
  const token = await getToken();
  const fields = Object.fromEntries(
    Object.entries(data)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, toFirestoreValue(v)])
  );
  const res = await fetch(`${BASE}/${collection}/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) throw new Error(`Firestore SET error: ${res.status} ${await res.text()}`);
}
