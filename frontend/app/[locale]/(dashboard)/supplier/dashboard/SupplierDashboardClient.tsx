"use client";

/**
 * Supplier Dashboard — first iteration.
 *
 * Visual language is intentionally aligned with `app/admin/AdminDashboardClient.tsx`
 * (cards, spacing, charts, motion).
 *
 * Stats cards are wired to the live backend endpoint
 * `GET /api/supplier/dashboard/stats` (see `api-clients/supplier-dashboard`).
 * Charts, recent activity, and pending actions still use demo data — those
 * sections remain clearly marked with a "Demo Data" badge until their
 * respective backend endpoints land.
 */

import { useEffect, useMemo, useState } from "react";
import { Box, Grid, Typography, Alert, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
  getSupplierDashboardStats,
  getSupplierDashboardBookingsByStatus,
  getSupplierVehicleStatusDistribution,
  type SupplierDashboardStats,
} from "@/api-clients/supplier-dashboard/supplier-dashboard";
import {
  getSupplierEarningsChart,
  getSupplierTopVehicles,
  type MonthlyRevenuePoint,
  type SupplierTopVehicle,
} from "@/api-clients/supplier-earnings/supplier-earnings";
import { logger } from "@/utils/logger";
import VehicleStats, { type StatItem } from "@/app/[locale]/(dashboard)/_components/VehicleStats";

// New Extracted Components
import EarningsChart from "./_components/EarningsChart";
import BookingsChart from "./_components/BookingsChart";
import TopVehiclesList from "./_components/TopVehiclesList";
import VehicleStatusChart from "./_components/VehicleStatusChart";
import RecentActivity from "./_components/RecentActivity";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

function formatCount(value: number): string {
  return Number.isFinite(value) ? Math.trunc(value).toLocaleString() : "0";
}

function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) return "$0";
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function SupplierDashboardClient() {
  const theme = useTheme();
  const { data: session, status: sessionStatus } = useSession({
    required: true,
  });
  const t = useTranslations("dashboard.supplierDashboard");

  const [stats, setStats] = useState<SupplierDashboardStats | null>(null);
  const [earningsChartData, setEarningsChartData] = useState<MonthlyRevenuePoint[] | null>(null);
  const [bookingsChartRaw, setBookingsChartRaw] = useState<{
    pending: number;
    confirmed: number;
    active: number;
    completed: number;
    cancelled: number;
  } | null>(null);
  const [topVehicles, setTopVehicles] = useState<SupplierTopVehicle[] | null>(null);
  const [vehicleStatusChartData, setVehicleStatusChartData] = useState<
    { name: string; value: number; color: string }[] | null
  >(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (sessionStatus === "authenticated" && !session.user.roles.includes("Supplier")) {
      window.location.href = "/";
      return;
    }

    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  }, [sessionStatus, session?.user.roles]);

  useEffect(() => {
    if (sessionStatus === "loading") return;

    let cancelled = false;

    const initStats = async () => {
      const accessToken = session.accessToken;
      if (!accessToken) {
        setStatsLoading(false);
        setStatsError(t("errors.notSignedIn"));
        return;
      }

      setStatsLoading(true);
      setStatsError(null);

      try {
        const [statsData, earningsData, bookingsData, topVehiclesData, vehicleStatusData] = await Promise.all([
          getSupplierDashboardStats(accessToken),
          getSupplierEarningsChart(accessToken),
          getSupplierDashboardBookingsByStatus(accessToken),
          getSupplierTopVehicles(accessToken, "bookings"),
          getSupplierVehicleStatusDistribution(accessToken),
        ]);
        if (cancelled) return;
        setStats(statsData);
        setEarningsChartData(earningsData);
        setTopVehicles(topVehiclesData);
        setBookingsChartRaw(bookingsData);

        const statusColors: Record<string, string> = {
          Available: theme.palette.success.main,
          Booked: theme.palette.primary.main,
          Unavailable: theme.palette.primary.main,
          FullyBooked: theme.palette.primary.main,
          Maintenance: theme.palette.error.main,
          ComingSoon: theme.palette.info.main,
          Retired: theme.palette.text.disabled,
        };

        const chartData = Object.entries(vehicleStatusData).map(([status, count]) => ({
          name: status,
          value: count,
          color: statusColors[status] || theme.palette.grey[500],
        }));

        setVehicleStatusChartData(chartData);
      } catch (err: unknown) {
        if (cancelled) return;
        logger.error("Failed to load supplier dashboard stats", err);
        setStatsError(t("errors.loadFailed"));
      } finally {
        if (!cancelled) {
          setStatsLoading(false);
        }
      }
    };

    void initStats();

    return () => {
      cancelled = true;
    };
  }, [session?.accessToken, sessionStatus, t, theme]);

  const bookingsChartData = useMemo(() => {
    if (!bookingsChartRaw) return null;
    return [
      { status: t("charts.bookingStatus.pending"), count: bookingsChartRaw.pending },
      { status: t("charts.bookingStatus.confirmed"), count: bookingsChartRaw.confirmed },
      { status: t("charts.bookingStatus.active"), count: bookingsChartRaw.active },
      { status: t("charts.bookingStatus.completed"), count: bookingsChartRaw.completed },
      { status: t("charts.bookingStatus.cancelled"), count: bookingsChartRaw.cancelled },
    ];
  }, [bookingsChartRaw, t]);

  const safeNum = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) ? v : 0);

  const summaryData = useMemo<StatItem[]>(
    () => [
      {
        label: t("stats.totalVehicles"),
        value: stats ? formatCount(safeNum(stats.totalVehicles)) : "—",
        icon: <DirectionsCarIcon fontSize="medium" />,
        color: "primary",
      },
      {
        label: t("stats.pendingVehicles"),
        value: stats ? formatCount(safeNum(stats.pendingVehicles)) : "—",
        icon: <HourglassTopIcon fontSize="medium" />,
        color: "warning",
      },
      {
        label: t("stats.activeBookings"),
        value: stats ? formatCount(safeNum(stats.activeBookings)) : "—",
        icon: <EventAvailableIcon fontSize="medium" />,
        color: "info",
      },
      {
        label: t("stats.totalEarnings"),
        value: stats ? formatCurrency(safeNum(stats.totalEarnings)) : "—",
        icon: <AttachMoneyIcon fontSize="medium" />,
        color: "success",
      },
    ],
    [stats, t]
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "background.default", fontFamily: "inherit" }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          {t("greeting.welcomeBack")}
          {session?.user.firstName ? `, ${session.user.firstName}` : ""}. {t("greeting.fleetPerformance")}
        </Typography>
      </Box>

      {statsError && (
        <Alert severity="warning" variant="outlined" sx={{ mb: 2.5, borderRadius: 2 }}>
          {statsError}
        </Alert>
      )}

      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants}>
          <VehicleStats items={summaryData} loading={statsLoading} sx={{ mb: 3 }} />
        </motion.div>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <motion.div variants={itemVariants} style={{ height: "100%", width: "100%" }}>
              <EarningsChart data={earningsChartData} mounted={mounted} />
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <motion.div variants={itemVariants} style={{ height: "100%", width: "100%" }}>
              <BookingsChart data={bookingsChartData} mounted={mounted} />
            </motion.div>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <motion.div variants={itemVariants} style={{ height: "100%" }}>
              <TopVehiclesList topVehicles={topVehicles} />
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }} sx={{ mb: 3 }}>
            <motion.div variants={itemVariants} style={{ height: "100%" }}>
              <VehicleStatusChart data={vehicleStatusChartData} mounted={mounted} />
            </motion.div>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 0 }}>
          <Grid size={{ xs: 12 }}>
            <motion.div variants={itemVariants} style={{ height: "100%" }}>
              <RecentActivity />
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
}
