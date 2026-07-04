import { getLocale, getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "@/shared/i18n/routing";
import { getPendingAssignments } from "@/api-clients/inspections/inspections";
import { listInspectors } from "@/api-clients/inspectors/inspectors";
import { logger } from "@/utils/logger";
import AssignmentCenterClient from "./_components/AssignmentCenterClient";

export async function generateMetadata({ params: { locale } }: { readonly params: { readonly locale: string } }) {
  const t = await getTranslations({ locale, namespace: "dashboardAdmin.assignmentCenter" });
  return {
    title: `${t("title")} | ARES Admin`,
    description: t("description"),
  };
}

export default async function AssignmentCenterPage() {
  const locale = await getLocale();
  const session = await getServerSession(authOptions);

  if (!session || !session.user.roles.includes("Admin") || !session.accessToken) {
    return redirect({ href: "/", locale });
  }

  let pendingAssignments: import("@/api-clients/inspections/inspections").PendingAssignment[] = [];
  let inspectors: import("@/api-clients/inspectors/inspectors").Inspector[] = [];

  try {
    const [assignmentsRes, inspectorsRes] = await Promise.all([
      getPendingAssignments(session.accessToken),
      listInspectors(true, session.accessToken),
    ]);
    pendingAssignments = assignmentsRes || [];
    inspectors = inspectorsRes || [];
  } catch (error) {
    logger.error("Failed to fetch data for Assignment Center", error);
  }

  return <AssignmentCenterClient initialAssignments={pendingAssignments} inspectors={inspectors} />;
}
