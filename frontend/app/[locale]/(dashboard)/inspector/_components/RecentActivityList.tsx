"use client";

import { Box, Typography, Stack, Paper, Skeleton, useTheme, alpha } from "@mui/material";
import { useTranslations } from "next-intl";
import type { InspectionSummary } from "@/api-clients/inspections/inspections";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { parseUtcDate } from "@/utils/dateTime";
import { useRouter } from "@/shared/i18n/routing";

interface RecentActivityListProps {
  readonly history: InspectionSummary[];
  readonly loading: boolean;
}

export default function RecentActivityList({ history, loading }: RecentActivityListProps) {
  const t = useTranslations("dashboardInspector.inspections");
  const theme = useTheme();
  const router = useRouter();

  if (loading) {
    return (
      <Stack spacing={2}>
        {[1, 2, 3].map(n => (
          <Skeleton key={n} variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
        ))}
      </Stack>
    );
  }

  if (history.length === 0) {
    return (
      <Box
        sx={{
          py: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "text.secondary",
        }}
      >
        <AssignmentIcon sx={{ fontSize: 40, mb: 1, color: "text.disabled" }} />
        <Typography variant="body2">{t("emptyState.noRecentActivity")}</Typography>
      </Box>
    );
  }

  // Display top 5 recent activities
  const displayHistory = history.slice(0, 5);

  return (
    <Stack spacing={2}>
      {displayHistory.map(item => {
        const isApproved = item.status === "Approved";
        const StatusIcon = isApproved ? CheckCircleOutlinedIcon : CancelOutlinedIcon;
        const color = isApproved ? theme.palette.success.main : theme.palette.error.main;
        const date = item.submittedAt ? parseUtcDate(item.submittedAt) : parseUtcDate(item.inspectionDate);

        return (
          <Paper
            key={item.inspectionId}
            elevation={0}
            onClick={() => {
              router.push(`/inspector/inspections/${item.inspectionId}`);
            }}
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: color,
                boxShadow: theme.palette.shadow.cardHover,
                transform: "translateY(-1px)",
              },
            }}
          >
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: alpha(color, 0.1),
                  color: color,
                }}
              >
                <StatusIcon fontSize="small" />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
                  {item.vehicleDisplayName || t("unknownVehicle", { fallback: "Unknown Vehicle" })}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <DirectionsCarIcon sx={{ fontSize: 14 }} />
                  {item.bookingNumber || "—"}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="caption" sx={{ color: color, fontWeight: 700, display: "block" }}>
                  {(() => {
                    const statusLower = (item.status || "").toLowerCase();
                    if (statusLower === "approved" || statusLower === "completed" || statusLower === "verified") {
                      return t("status.approved");
                    }
                    if (statusLower === "rejected" || statusLower === "failed") {
                      return t("status.rejected");
                    }
                    return t("status.pending");
                  })()}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {date.toLocaleDateString()}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        );
      })}
    </Stack>
  );
}
