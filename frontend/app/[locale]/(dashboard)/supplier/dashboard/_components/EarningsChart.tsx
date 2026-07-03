"use client";

import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTranslations } from "next-intl";
import { type MonthlyRevenuePoint } from "@/api-clients/supplier-earnings/supplier-earnings";

interface EarningsChartProps {
  data: MonthlyRevenuePoint[] | null;
  mounted: boolean;
}

export default function EarningsChart({ data, mounted }: EarningsChartProps) {
  const theme = useTheme();
  const t = useTranslations("dashboard.supplierDashboard");

  return (
    <Card
      elevation={0}
      sx={th => ({
        borderRadius: 2,
        border: "1px solid",
        borderColor: th.palette.border.main,
        height: "100%",
        boxShadow: th.palette.shadow.card,
      })}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5, gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {t("charts.earningsOverview")}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ width: "100%", height: 280, minWidth: 0, position: "relative", overflow: "hidden" }}>
          {mounted && data && (
            <ResponsiveContainer width="100%" height={280} minWidth={0}>
              <AreaChart data={data} margin={{ top: 10, right: 16, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="supplierEarningsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value: number) => `$${value.toLocaleString()}`}
                />
                <Tooltip
                  formatter={(value: unknown) => [`$${(value as number).toLocaleString()}`, t("charts.earnings")]}
                  contentStyle={{
                    borderRadius: 8,
                    border: `1px solid ${theme.palette.divider}`,
                    background: theme.palette.background.paper,
                    boxShadow: theme.shadows[3],
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={theme.palette.primary.main}
                  strokeWidth={2.5}
                  fill="url(#supplierEarningsFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
