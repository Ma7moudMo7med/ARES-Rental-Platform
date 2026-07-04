"use client";

import { type JSX, useMemo, useEffect, useState } from "react";
import { Box, Typography, Card, useTheme, alpha } from "@mui/material";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import {
  DirectionsCarFilledTwoTone as CarIcon,
  CheckCircleOutlineRounded as AvailableIcon,
  BuildOutlined as MaintenanceIcon,
} from "@mui/icons-material";
// eslint-disable-next-line sonarjs/deprecation
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { StatCard } from "../../../_components/VehicleStats";

export interface FleetOverviewProps {
  readonly total: number;
  readonly availableCount: number;
  readonly rentalCount: number;
  readonly maintenanceCount: number;
  readonly trends?: {
    readonly totalAssets?: number;
    readonly available?: number;
    readonly maintenance?: number;
  };
}

function LegendItem({ color, label, pct }: Readonly<{ color: string; label: string; pct: number }>): JSX.Element {
  return (
    <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 0 }}>
      <Stack direction="row" spacing={0.4} sx={{ alignItems: "center" }}>
        <Box
          sx={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            bgcolor: color,
            flexShrink: 0,
          }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 14 }}>
          {label}
        </Typography>
      </Stack>
      <Typography variant="caption" sx={{ fontWeight: 700, fontSize: 12, minWidth: 32, textAlign: "right" }}>
        {pct}%
      </Typography>
    </Stack>
  );
}

function DonutChart({
  available,
  booked,
  maintenance,
  unavailable,
  total,
}: Readonly<{
  available: number;
  booked: number;
  maintenance: number;
  unavailable: number;
  total: number;
}>): JSX.Element {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = useMemo(
    () => [
      { value: available, color: theme.palette.success.main },
      { value: booked, color: theme.palette.primary.main },
      { value: maintenance, color: theme.palette.warning.main },
      { value: unavailable, color: theme.palette.info.main },
    ],
    [available, booked, maintenance, unavailable, theme]
  );

  if (!mounted) {
    return (
      <Box sx={{ width: 110, height: 110, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography sx={{ fontWeight: 800, fontSize: 22, lineHeight: 1 }}>{total}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", width: 110, height: 110, flexShrink: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={38}
            outerRadius={48}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              // eslint-disable-next-line @typescript-eslint/no-deprecated, sonarjs/deprecation
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: 22, lineHeight: 1 }}>{total}</Typography>
      </Box>
    </Box>
  );
}

export default function FleetOverview({
  total,
  availableCount,
  rentalCount,
  maintenanceCount,
  trends,
}: FleetOverviewProps): JSX.Element {
  const theme = useTheme();
  const t = useTranslations("dashboardAdmin.vehicles");

  const unavailableCount = Math.max(0, total - (availableCount + rentalCount + maintenanceCount));
  const safeTotal = total || 1;
  const availPct = Math.round((availableCount / safeTotal) * 100);
  const bookedPct = Math.round((rentalCount / safeTotal) * 100);
  const maintenancePct = Math.round((maintenanceCount / safeTotal) * 100);
  const unavailablePct = Math.round((unavailableCount / safeTotal) * 100);

  // Convert numeric trends to string percentage changes for StatCard compatibility
  const totalTrend = trends?.totalAssets;
  const totalChange = totalTrend !== undefined ? `${totalTrend >= 0 ? "+" : ""}${totalTrend}%` : undefined;
  const totalIsUp = totalTrend !== undefined ? totalTrend >= 0 : undefined;

  const availTrend = trends?.available;
  const availChange = availTrend !== undefined ? `${availTrend >= 0 ? "+" : ""}${availTrend}%` : undefined;
  const availIsUp = availTrend !== undefined ? availTrend >= 0 : undefined;

  const maintenanceTrend = trends?.maintenance;
  const maintenanceChange =
    maintenanceTrend !== undefined ? `${maintenanceTrend >= 0 ? "+" : ""}${maintenanceTrend}%` : undefined;
  const maintenanceIsUp = maintenanceTrend !== undefined ? maintenanceTrend >= 0 : undefined;

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {/* 1. Donut Chart Card */}
      <Grid size={{ xs: 12, sm: 8, lg: 4.5 }}>
        <Card
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            border: "1px solid",
            borderColor: theme.palette.border.main,
            boxShadow: theme.palette.shadow.card,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 3, sm: 4 }}
            sx={{ alignItems: "center", gap: 0, justifyContent: "center", height: "100%" }}
          >
            {/* Chart */}
            <Box sx={{ flexShrink: 0 }}>
              <DonutChart
                available={availableCount}
                booked={rentalCount}
                maintenance={maintenanceCount}
                unavailable={unavailableCount}
                total={total}
              />
            </Box>

            {/* Legend */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(1, 1fr)" },
                gap: 1,
                ml: "auto",
                flexGrow: 1,
                width: "100%",
              }}
            >
              <LegendItem color={theme.palette.success.main} label={t("statusLabels.available")} pct={availPct} />
              <LegendItem color={theme.palette.primary.main} label={t("statusLabels.booked")} pct={bookedPct} />
              <LegendItem
                color={theme.palette.warning.main}
                label={t("statusLabels.maintenance")}
                pct={maintenancePct}
              />
              <LegendItem color={theme.palette.info.main} label={t("statusLabels.unavailable")} pct={unavailablePct} />
            </Box>
          </Stack>
        </Card>
      </Grid>

      {/* 2. Total Assets Card */}
      <Grid size={{ xs: 12, sm: 4, md: 4, lg: 2.5 }}>
        <StatCard
          label={t("stats.totalAssets")}
          value={total}
          color="primary"
          icon={<CarIcon />}
          change={totalChange}
          isUp={totalIsUp}
        />
      </Grid>

      {/* 3. Available Now Card */}
      <Grid size={{ xs: 12, sm: 6, md: 6, lg: 2.5 }}>
        <StatCard
          label={t("stats.availableNow")}
          value={availableCount}
          color="success"
          icon={<AvailableIcon />}
          change={availChange}
          isUp={availIsUp}
        />
      </Grid>

      {/* 4. In Maintenance Card */}
      <Grid size={{ xs: 12, sm: 6, md: 6, lg: 2.5 }}>
        <StatCard
          label={t("stats.inMaintenance")}
          value={maintenanceCount}
          color="warning"
          icon={<MaintenanceIcon />}
          change={maintenanceChange}
          isUp={maintenanceIsUp}
        />
      </Grid>
    </Grid>
  );
}
