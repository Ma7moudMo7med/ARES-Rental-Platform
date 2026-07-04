"use client";

import { Box, Typography, Stack, Paper, Skeleton, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";
import type { InspectorTask } from "@/api-clients/inspections/inspections";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";
import { parseUtcDate } from "@/utils/dateTime";
import { useRouter } from "@/shared/i18n/routing";

interface UpcomingTasksListProps {
  readonly tasks: InspectorTask[];
  readonly loading: boolean;
}

export default function UpcomingTasksList({ tasks, loading }: UpcomingTasksListProps) {
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

  if (tasks.length === 0) {
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
        <EventIcon sx={{ fontSize: 40, mb: 1, color: "text.disabled" }} />
        <Typography variant="body2">{t("emptyState.noUpcoming")}</Typography>
      </Box>
    );
  }

  // Display top 5 upcoming tasks
  const displayTasks = tasks.slice(0, 5);

  return (
    <Stack spacing={2}>
      {displayTasks.map(task => {
        const isCheckOut = task.inspectionType === "CheckOut";
        const accentColor = isCheckOut ? theme.palette.status.active.main : theme.palette.status.cancelled.main;
        const date = parseUtcDate(task.scheduledTime);

        return (
          <Paper
            key={task.inspectionId}
            elevation={0}
            onClick={() => {
              router.push(`/inspector/inspections/${task.inspectionId}`);
            }}
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              borderLeft: `4px solid ${accentColor}`,
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: accentColor,
                boxShadow: theme.palette.shadow.cardHover,
                transform: "translateY(-1px)",
              },
            }}
          >
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
                  {task.vehicleName}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <EventIcon sx={{ fontSize: 14 }} />
                  {date.toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="caption" sx={{ color: accentColor, fontWeight: 700, display: "block" }}>
                  {isCheckOut ? t("card.checkOutBadge") : t("card.checkInBadge")}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    justifyContent: "flex-end",
                  }}
                >
                  <AccessTimeIcon sx={{ fontSize: 12 }} />
                  {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        );
      })}
    </Stack>
  );
}
