"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Box, Typography, useTheme, Grid } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CarRepairIcon from "@mui/icons-material/CarRepair";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import {
  getInspectorTodayStats,
  getInspectorTasks,
  getInspectionHistory,
  type InspectorTodayStats,
  type InspectorTask,
  type InspectionSummary,
} from "@/api-clients/inspections/inspections";
import { logger } from "@/utils/logger";
import VehicleStats from "@/app/[locale]/(dashboard)/_components/VehicleStats";
import TodayTasksList from "./_components/TodayTasksList";
import RecentActivityList from "./_components/RecentActivityList";
import UpcomingTasksList from "./_components/UpcomingTasksList";

export default function InspectorDashboardPage() {
  const theme = useTheme();
  const t = useTranslations("dashboardInspector.inspections");
  const [tasks, setTasks] = useState<InspectorTask[]>([]);
  const [stats, setStats] = useState<InspectorTodayStats | null>(null);
  const [history, setHistory] = useState<InspectionSummary[]>([]);
  const [upcoming, setUpcoming] = useState<InspectorTask[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tasksData, statsData, historyData, upcomingData] = await Promise.all([
        getInspectorTasks("today"),
        getInspectorTodayStats(),
        getInspectionHistory(),
        getInspectorTasks("upcoming"),
      ]);
      setTasks(tasksData);
      setStats(statsData);
      setHistory(historyData);
      setUpcoming(upcomingData);
    } catch (err) {
      logger.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const dashboardStats = [
    {
      label: t("checkOuts"),
      value: stats?.checkOutsCount ?? 0,
      color: "success",
      icon: <DirectionsCarIcon fontSize="small" />,
      subtitle: t("checkOutsSubtitle"),
    },
    {
      label: t("checkIns"),
      value: stats?.checkInsCount ?? 0,
      color: "info",
      icon: <CarRepairIcon fontSize="small" />,
      subtitle: t("checkInsSubtitle"),
    },
    {
      label: t("overdue"),
      value: stats?.overdueCount ?? 0,
      color: "warning",
      icon: <WarningAmberIcon fontSize="small" />,
      subtitle: t("overdueSubtitle"),
    },
    {
      label: t("completedToday"),
      value: stats?.completedTodayCount ?? 0,
      color: "secondary",
      icon: <CheckCircleOutlinedIcon fontSize="small" />,
      subtitle: t("completedTodaySubtitle"),
    },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3 } }}>
      {/* Page header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {t("title")}
        </Typography>
        <Typography sx={{ color: "text.secondary" }} variant="body2">
          {t("description")}
        </Typography>
      </Box>

      {/* KPI stats */}
      <VehicleStats items={dashboardStats} loading={loading} />

      {/* Today's Tasks — 1-column full-width */}
      <Box
        sx={{
          mt: 4,
          mb: 4,
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          boxShadow: theme.palette.shadow.card,
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {t("sectionTitle")}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {t("sectionSubtitle")}
          </Typography>
        </Box>

        <TodayTasksList tasks={tasks} loading={loading} />
      </Box>

      {/* Bottom Section: Recent Activity & Upcoming */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              boxShadow: theme.palette.shadow.card,
              height: "100%",
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {t("recentActivityTitle")}
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <RecentActivityList history={history} loading={loading} />
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              boxShadow: theme.palette.shadow.card,
              height: "100%",
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {t("upcomingTitle")}
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <UpcomingTasksList tasks={upcoming} loading={loading} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
