"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
  alpha,
  useTheme,
  Skeleton,
  Alert,
} from "@mui/material";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import PaymentIcon from "@mui/icons-material/Payment";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import GppGoodIcon from "@mui/icons-material/GppGood";
import { useLocale, useTranslations } from "next-intl";
import { ar, enUS } from "date-fns/locale";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import {
  getSupplierRecentActivity,
  type RecentActivityItem,
} from "@/api-clients/supplier-dashboard/supplier-dashboard";
import { logger } from "@/utils/logger";

const ACTIVITY_META: Record<
  string,
  { color: "primary" | "success" | "warning" | "info" | "secondary"; icon: React.ReactNode }
> = {
  booking: { color: "primary", icon: <EventAvailableOutlinedIcon fontSize="small" /> },
  payment: { color: "success", icon: <PaymentIcon fontSize="small" /> },
  user: { color: "info", icon: <PersonAddIcon fontSize="small" /> },
  vehicle: { color: "warning", icon: <DirectionsCarIcon fontSize="small" /> },
  verification: { color: "secondary", icon: <GppGoodIcon fontSize="small" /> },
};

export default function RecentActivity() {
  const theme = useTheme();
  const locale = useLocale();
  const dateLocale = locale === "ar" ? ar : enUS;
  const t = useTranslations("dashboard.supplierDashboard");
  const { data: session, status: sessionStatus } = useSession();

  const [activities, setActivities] = useState<RecentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchActivities = async () => {
      if (sessionStatus === "loading") return;
      if (!session?.accessToken) {
        if (sessionStatus === "unauthenticated") {
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getSupplierRecentActivity(session.accessToken);
        if (!cancelled) {
          setActivities(data);
        }
      } catch (err: unknown) {
        if (cancelled) return;
        logger.error("Failed to load recent activities", err);
        setError(t("errors.loadFailed"));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchActivities();

    return () => {
      cancelled = true;
    };
  }, [session?.accessToken, sessionStatus, t]);

  const getRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return formatDistanceToNow(date, { addSuffix: true, locale: dateLocale });
    } catch {
      return "";
    }
  };

  const getLocalizedMessage = (item: RecentActivityItem) => {
    const msg = item.message;
    if (!msg) return "";

    if (item.type === "booking") {
      const match = msg.match(/Booking\s+#([A-Za-z0-9-]+)\s+created\s+by\s+(.+)/i);
      if (match) {
        return t("liveActivity.bookingCreatedByUser", { id: match[1], name: match[2] });
      }
      const fallbackMatch = msg.match(/Booking\s+#([A-Za-z0-9-]+)/i);
      if (fallbackMatch) {
        return t("liveActivity.bookingCreated", { id: fallbackMatch[1] });
      }
    }

    if (item.type === "payment") {
      const match = msg.match(/Payment\s+completed\s+for\s+Booking\s+#([A-Za-z0-9-]+)/i);
      if (match) {
        return t("liveActivity.paymentCompleted", { id: match[1] });
      }
    }

    if (item.type === "vehicle") {
      const match = msg.match(/Vehicle\s+added:\s*(.+)/i);
      if (match) {
        return t("liveActivity.vehicleAdded", { label: match[1] });
      }
    }

    return msg;
  };

  return (
    <Card
      elevation={0}
      sx={th => ({
        borderRadius: 2,
        border: "1px solid",
        borderColor: th.palette.border.main,
        height: "100%",
        boxShadow: th.palette.shadow.card,
        display: "flex",
        flexDirection: "column",
      })}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 }, flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5, gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {t("recentActivity")}
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="warning" variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Stack divider={<Divider flexItem />} spacing={0} sx={{ flexGrow: 1 }}>
          {loading ? (
            Array.from(new Array(3)).map((_, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.5 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Skeleton variant="text" width="80%" height={24} />
                  <Skeleton variant="text" width="40%" height={20} />
                </Box>
              </Box>
            ))
          ) : activities.length === 0 && !error ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 4,
                px: 2,
                flexGrow: 1,
                textAlign: "center",
              }}
            >
              <NotificationsNoneIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1.5 }} />
              <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: 500 }}>
                {t("noRecentActivity")}
              </Typography>
            </Box>
          ) : (
            activities.map((item, index) => {
              const meta = ACTIVITY_META[item.type] || {
                color: "info",
                icon: <NotificationsNoneIcon fontSize="small" />,
              };
              return (
                <Box
                  key={`${item.type}-${index}`}
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
                      {getLocalizedMessage(item)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {getRelativeTime(item.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              );
            })
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
