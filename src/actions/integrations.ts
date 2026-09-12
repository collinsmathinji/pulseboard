"use server";

import { revalidatePath } from "next/cache";
import { requireSession, getWorkspace, isPaid } from "@/lib/workspace";
import { prisma } from "@/lib/prisma";
import {
  normalizeSocialUrl,
  parseGaId,
  parseGtmId,
} from "@/lib/integrations";

async function requirePaidWorkspace() {
  const session = await requireSession();
  const workspace = await getWorkspace(session.user.id);
  if (!isPaid(workspace)) {
    throw new Error("Paid plan required");
  }
  return workspace;
}

export async function saveAnalytics(formData: FormData) {
  const workspace = await requirePaidWorkspace();
  const gaMeasurementId = parseGaId(String(formData.get("gaMeasurementId") ?? ""));
  const gtmContainerId = parseGtmId(String(formData.get("gtmContainerId") ?? ""));

  await prisma.workspace.update({
    where: { id: workspace.id },
    data: { gaMeasurementId, gtmContainerId },
  });

  revalidatePath("/app");
  revalidatePath("/app/integrations");
}

export async function clearAnalytics() {
  const workspace = await requirePaidWorkspace();
  await prisma.workspace.update({
    where: { id: workspace.id },
    data: { gaMeasurementId: "", gtmContainerId: "" },
  });
  revalidatePath("/app");
  revalidatePath("/app/integrations");
}

export async function saveSocial(formData: FormData) {
  const workspace = await requirePaidWorkspace();
  await prisma.workspace.update({
    where: { id: workspace.id },
    data: {
      socialX: normalizeSocialUrl("x", String(formData.get("socialX") ?? "")),
      socialLinkedin: normalizeSocialUrl(
        "linkedin",
        String(formData.get("socialLinkedin") ?? ""),
      ),
      socialInstagram: normalizeSocialUrl(
        "instagram",
        String(formData.get("socialInstagram") ?? ""),
      ),
      socialFacebook: normalizeSocialUrl(
        "facebook",
        String(formData.get("socialFacebook") ?? ""),
      ),
      socialYoutube: normalizeSocialUrl(
        "youtube",
        String(formData.get("socialYoutube") ?? ""),
      ),
      socialWebsite: normalizeSocialUrl(
        "website",
        String(formData.get("socialWebsite") ?? ""),
      ),
    },
  });

  revalidatePath("/app");
  revalidatePath("/app/integrations");
}

export async function clearSocial() {
  const workspace = await requirePaidWorkspace();
  await prisma.workspace.update({
    where: { id: workspace.id },
    data: {
      socialX: "",
      socialLinkedin: "",
      socialInstagram: "",
      socialFacebook: "",
      socialYoutube: "",
      socialWebsite: "",
    },
  });
  revalidatePath("/app");
  revalidatePath("/app/integrations");
}
