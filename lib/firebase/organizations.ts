import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getDb } from "./config";

export interface Organization {
  id: string;
  name: string;
  industryId: string;
  city: string;
  country: string;
  ownerId: string;
  planId: string;
  status: "active" | "inactive" | "trial";
  healthScore: number;
  phone?: string;
  website?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export async function createOrganization(
  orgId: string,
  data: Omit<Organization, "id" | "createdAt" | "updatedAt">
): Promise<void> {
  await setDoc(doc(getDb(), "organizations", orgId), {
    ...data,
    healthScore: 100,
    status: "trial",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getOrganization(orgId: string): Promise<Organization | null> {
  const snap = await getDoc(doc(getDb(), "organizations", orgId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Organization;
}

export async function updateOrganization(
  orgId: string,
  data: Partial<Organization>
): Promise<void> {
  await updateDoc(doc(getDb(), "organizations", orgId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
