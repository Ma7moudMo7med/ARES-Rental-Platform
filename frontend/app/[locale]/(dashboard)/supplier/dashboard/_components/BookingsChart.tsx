"use client";

import { Box, Card, CardContent, Typography, useTheme, alpha } from "@mui/material";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTranslations } from "next-intl";

interface BookingsChartData {
  status: string;
  count: number;
}

interface BookingsChartProps {
  data: BookingsChartData[] | null;
  mounted: boolean;
}

export default function BookingsChart({ data, mounted }: BookingsChartProps) {
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
              {t("charts.bookingsByStatus")}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ width: "100%", height: 280, minWidth: 0, position: "relative", overflow: "hidden" }}>
          {mounted && data && (
            <ResponsiveContainer width="100%" height={280} minWidth={0}>
              <BarChart data={data} margin={{ top: 10, right: 16, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                <XAxis
                  dataKey="status"
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: alpha(theme.palette.primary.main, 0.06) }}
                  contentStyle={{
                    borderRadius: 8,
                    border: `1px solid ${theme.palette.divider}`,
                    background: theme.palette.background.paper,
                    boxShadow: theme.shadows[3],
                  }}
                />
                <Bar dataKey="count" fill={theme.palette.primary.main} radius={[8, 8, 0, 0]} maxBarSize={42} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
