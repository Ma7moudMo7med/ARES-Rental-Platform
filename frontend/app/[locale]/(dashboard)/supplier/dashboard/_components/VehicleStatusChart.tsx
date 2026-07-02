"use client";

import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useTranslations } from "next-intl";

interface VehicleStatusData {
  name: string;
  value: number;
  color: string;
}

interface VehicleStatusChartProps {
  data: VehicleStatusData[] | null;
  mounted: boolean;
}

export default function VehicleStatusChart({ data, mounted }: VehicleStatusChartProps) {
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
              {t("vehicleStatus.heading")}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: "100%", height: 280, minWidth: 0, position: "relative", overflow: "hidden" }}>
          {mounted && data && (
            <ResponsiveContainer width="100%" height={280} minWidth={0}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    // eslint-disable-next-line @typescript-eslint/no-deprecated, sonarjs/deprecation
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: `1px solid ${theme.palette.divider}`,
                    background: theme.palette.background.paper,
                    boxShadow: theme.shadows[3],
                  }}
                  itemStyle={{
                    fontWeight: 600,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Box>

        {mounted && data && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center", mt: 1 }}>
            {data
              .filter(v => v.value > 0)
              .map((status, idx) => (
                <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: status.color }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {status.name} ({status.value})
                  </Typography>
                </Box>
              ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
