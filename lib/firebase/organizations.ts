import { fsGet, fsSet } from "./firestore-rest";

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
  await fsSet("organizations", orgId, {
    ...data,
    healthScore: 100,
    status: "trial",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function getOrganization(orgId: string): Promise<Organization | null> {
  const data = await fsGet("organizations", orgId);
  if (!data) return null;
  return { id: orgId, ...data } as Organization;
}

export async function updateOrganization(
  orgId: string,
  data: Partial<Organization>
): Promise<void> {
  await fsSet("organizations", orgId, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}
