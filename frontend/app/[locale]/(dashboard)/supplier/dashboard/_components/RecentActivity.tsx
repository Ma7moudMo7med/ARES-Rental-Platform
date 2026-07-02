"use client";

import { Avatar, Box, Card, CardContent, Divider, Stack, Typography, alpha, useTheme } from "@mui/material";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import PaymentIcon from "@mui/icons-material/Payment";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { useTranslations } from "next-intl";
import DemoDataBadge from "../../_components/DemoDataBadge";

interface ActivityItem {
  id: string;
  type: "booking" | "payment" | "user" | "vehicle";
  messageKey: string;
  timeKey: string;
}

const ACTIVITY_META: Record<
  ActivityItem["type"],
  { color: "primary" | "success" | "warning" | "info"; icon: React.ReactNode }
> = {
  booking: { color: "primary", icon: <EventAvailableOutlinedIcon fontSize="small" /> },
  payment: { color: "success", icon: <PaymentIcon fontSize="small" /> },
  user: { color: "info", icon: <PersonAddIcon fontSize="small" /> },
  vehicle: { color: "warning", icon: <DirectionsCarIcon fontSize="small" /> },
};

const DEMO_ACTIVITY_ITEMS: { id: string; type: ActivityItem["type"]; messageKey: string; timeKey: string }[] = [
  { id: "a1", type: "booking", messageKey: "newBooking", timeKey: "minutesAgo" },
  { id: "a2", type: "payment", messageKey: "payoutProcessed", timeKey: "hoursAgo" },
  { id: "a3", type: "vehicle", messageKey: "listingApproved", timeKey: "fiveHoursAgo" },
  { id: "a4", type: "booking", messageKey: "bookingCompleted", timeKey: "yesterday" },
  { id: "a5", type: "user", messageKey: "customerReview", timeKey: "yesterday" },
];

export default function RecentActivity() {
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
              {t("recentActivity")}
            </Typography>
            <DemoDataBadge />
          </Box>
        </Box>

        <Stack divider={<Divider flexItem />} spacing={0}>
          {DEMO_ACTIVITY_ITEMS.map(item => {
            const meta = ACTIVITY_META[item.type];
            return (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  py: 1.5,
                }}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: alpha(theme.palette[meta.color].main, 0.12),
                    color: `${meta.color}.main`,
                  }}
                >
                  {meta.icon}
                </Avatar>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                    {t(`demoActivity.${item.messageKey}`)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {t(`demoActivityTime.${item.timeKey}`)}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}
