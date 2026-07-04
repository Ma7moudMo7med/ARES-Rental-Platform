"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Card,
  Typography,
  Stack,
  Chip,
  CircularProgress,
  IconButton,
  Container,
  Alert,
  Tooltip,
  Button,
  Snackbar,
} from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { formatUtcDateTime } from "@/utils/dateTime";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  type NotificationItem,
  type NotificationsResponse,
} from "@/api-clients/notfications/notfications";
import { logger } from "@/utils/logger";
import DeleteNotificationDialog from "@/components/notifications/DeleteNotificationDialog";
import { translateNotification } from "@/utils/notificationTranslator";
import { useRouter } from "next/navigation";

// Extended Notification Type
type InspectorNotification = NotificationItem & {
  bookingNumber?: string | null;
  vehicleName?: string | null;
  inspectionType?: string | null;
  actionUrl?: string | null;
};

export default function InspectorNotificationsPage() {
  const { data: session, status } = useSession();
  const t = useTranslations("dashboardInspector.notifications");
  const locale = useLocale();
  const router = useRouter();

  const [notifications, setNotifications] = useState<InspectorNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  // Deletion and toast state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingNotification, setDeletingNotification] = useState<InspectorNotification | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const token = session?.accessToken;

  const fetchData = useCallback(
    async (background = false) => {
      if (!token) return;

      try {
        if (!background) setLoading(true);
        const data = (await getNotifications(token)) as InspectorNotification[] | NotificationsResponse;

        let notificationData: InspectorNotification[] = [];
        if (Array.isArray(data)) {
          notificationData = data as InspectorNotification[];
        } else if ((data as { notifications?: InspectorNotification[] }).notifications) {
          notificationData = (data as { notifications?: InspectorNotification[] }).notifications!;
        }
        setNotifications(notificationData);
        setError(null);
      } catch (err) {
        if (!background) setError(t("loadError"));
        logger.error("Fetch Error", err);
      } finally {
        if (!background) setLoading(false);
      }
    },
    [token, t]
  );

  useEffect(() => {
    if (status === "authenticated") {
      void fetchData();
    }
  }, [status, fetchData]);

  useEffect(() => {
    const handleUpdate = () => {
      void fetchData(true);
    };
    window.addEventListener("notifications-updated", handleUpdate);
    return () => {
      window.removeEventListener("notifications-updated", handleUpdate);
    };
  }, [fetchData]);

  const handleMarkRead = async (id: string, redirectUrl?: string | null) => {
    if (!token || processingId) return;

    try {
      setProcessingId(id);
      await markNotificationAsRead(id, token);

      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
      window.dispatchEvent(new CustomEvent("notifications-updated"));

      if (redirectUrl) {
        router.push(redirectUrl);
      }
    } catch (err) {
      logger.error("Update failed", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleMarkAll = async () => {
    if (!token || markingAll) return;
    const hasUnread = notifications.some(n => !n.isRead);
    if (!hasUnread) return;

    setMarkingAll(true);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      await markAllNotificationsAsRead(token);
      window.dispatchEvent(new CustomEvent("notifications-updated"));
    } catch (err) {
      logger.error("Mark all as read failed; refetching", err);
      await fetchData();
    } finally {
      setMarkingAll(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, item: InspectorNotification) => {
    e.stopPropagation();
    setDeletingNotification(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!token || !deletingNotification) return;
    setDeleting(true);
    try {
      await deleteNotification(deletingNotification.id, token);

      setNotifications(prev => prev.filter(n => n.id !== deletingNotification.id));
      setToast({
        open: true,
        message: t("deleteSuccess"),
        severity: "success",
      });
      window.dispatchEvent(new CustomEvent("notifications-updated"));
      setDeleteDialogOpen(false);
    } catch (err) {
      logger.error("Failed to delete notification", err);
      if (err instanceof Error && err.message.includes("404")) {
        setNotifications(prev => prev.filter(n => n.id !== deletingNotification.id));
        setToast({
          open: true,
          message: t("deleteSuccess"),
          severity: "success",
        });
        window.dispatchEvent(new CustomEvent("notifications-updated"));
        setDeleteDialogOpen(false);
      } else {
        setToast({
          open: true,
          message: t("deleteError"),
          severity: "error",
        });
      }
    } finally {
      setDeleting(false);
    }
  };

  const getNotificationIcon = (type?: string | null) => {
    switch (type) {
      case "InspectionAssigned":
      case "InspectionReassigned":
        return <AssignmentIcon color="primary" />;
      default:
        return <NotificationsActiveIcon color="action" />;
    }
  };

  // 1. Loading State
  if (status === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  // 2. Unauthenticated State
  if (status === "unauthenticated") {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">{t("signInPrompt")}</Alert>
      </Container>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotifications = filter === "unread" ? notifications.filter(n => !n.isRead) : notifications;

  const renderContent = (): React.ReactNode => {
    if (loading) {
      return (
        <Box sx={{ p: 10, textAlign: "center" }}>
          <CircularProgress size={30} />
          <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
            {t("loadingFeed")}
          </Typography>
        </Box>
      );
    }

    if (filteredNotifications.length === 0) {
      return (
        <Box sx={{ p: 10, textAlign: "center" }}>
          <Typography color="text.secondary">
            {filter === "unread" ? t("noNotificationsDesc") : t("allCaughtUp")}
          </Typography>
        </Box>
      );
    }

    return (
      <Stack spacing={2}>
        {filteredNotifications.map(n => (
          <Card
            key={n.id}
            elevation={n.isRead ? 0 : 2}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: n.isRead ? "divider" : "primary.light",
              bgcolor: n.isRead ? "background.paper" : "action.hover",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: theme => theme.shadows[4],
              },
              cursor: n.actionUrl ? "pointer" : "default",
            }}
            onClick={() => {
              if (n.actionUrl) {
                if (!n.isRead) {
                  void handleMarkRead(n.id, n.actionUrl);
                } else {
                  router.push(n.actionUrl);
                }
              }
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ p: 3, alignItems: { xs: "flex-start", sm: "center" } }}
            >
              {/* Icon & Unread Indicator */}
              <Box sx={{ position: "relative" }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: n.isRead ? "action.selected" : "primary.lighter",
                    color: n.isRead ? "text.secondary" : "primary.main",
                  }}
                >
                  {getNotificationIcon(n.type)}
                </Box>
                {!n.isRead && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "error.main",
                      border: "2px solid",
                      borderColor: "background.paper",
                    }}
                  />
                )}
              </Box>

              {/* Content */}
              <Box sx={{ flex: 1 }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, mb: 0.5 }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: n.isRead ? 500 : 700 }}
                    color={n.isRead ? "text.secondary" : "text.primary"}
                  >
                    {translateNotification(n, locale).title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.disabled", whiteSpace: "nowrap" }}>
                    {formatUtcDateTime(n.createdAt, locale, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                  {translateNotification(n, locale).message}
                </Typography>

                {/* Metadata Badges */}
                {n.bookingNumber && (
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1, mt: 1 }}>
                    {n.bookingNumber && (
                      <Chip size="small" variant="outlined" label={`#${n.bookingNumber}`} color="primary" />
                    )}
                    {n.vehicleName && (
                      <Chip
                        size="small"
                        variant="outlined"
                        icon={<DirectionsCarIcon fontSize="small" />}
                        label={n.vehicleName}
                      />
                    )}
                    {n.inspectionType && <Chip size="small" variant="outlined" label={n.inspectionType} />}
                  </Stack>
                )}
              </Box>

              {/* Actions */}
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                  mt: { xs: 2, sm: 0 },
                  width: { xs: "100%", sm: "auto" },
                  justifyContent: { xs: "flex-end", sm: "center" },
                }}
              >
                {!n.isRead ? (
                  <Tooltip title={t("markAsReadTooltip")}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={e => {
                        e.stopPropagation();
                        void handleMarkRead(n.id);
                      }}
                      disabled={processingId === n.id}
                      sx={{ bgcolor: "background.paper", boxShadow: 1 }}
                    >
                      {processingId === n.id ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <DoneAllIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                ) : null}

                {n.actionUrl && (
                  <Button
                    variant="contained"
                    size="small"
                    endIcon={<KeyboardArrowRightIcon />}
                    onClick={e => {
                      e.stopPropagation();
                      if (!n.isRead) {
                        void handleMarkRead(n.id, n.actionUrl);
                      } else {
                        router.push(n.actionUrl!);
                      }
                    }}
                    sx={{ textTransform: "none", borderRadius: 2 }}
                  >
                    {t("actions.view")}
                  </Button>
                )}

                <Tooltip title={t("deleteTooltip")}>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={e => {
                      handleDeleteClick(e, n);
                    }}
                    sx={{ bgcolor: "background.paper", boxShadow: 1 }}
                  >
                    <DeleteOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          </Card>
        ))}
      </Stack>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, mb: 4, gap: 2 }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "800", display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            {t("title")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("subtitle")}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Chip
            label={`${unreadCount} ${t("unread")}`}
            color={unreadCount > 0 ? "error" : "default"}
            sx={{ fontWeight: "bold" }}
          />
          <Tooltip title={t("refresh")}>
            <span>
              <IconButton
                onClick={() => {
                  void fetchData();
                }}
                disabled={loading}
                color="primary"
                sx={{ bgcolor: "action.hover" }}
              >
                {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
              </IconButton>
            </span>
          </Tooltip>
          <Button
            variant="outlined"
            size="small"
            startIcon={markingAll ? <CircularProgress size={16} /> : <DoneAllIcon />}
            onClick={() => {
              void handleMarkAll();
            }}
            disabled={markingAll || unreadCount === 0}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
          >
            {t("markAllRead")}
          </Button>
        </Stack>
      </Stack>

      {/* Filter Tabs */}
      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        <Button
          variant={filter === "all" ? "contained" : "outlined"}
          size="small"
          onClick={() => setFilter("all")}
          sx={{ borderRadius: 2, textTransform: "none" }}
          color={filter === "all" ? "primary" : "inherit"}
        >
          {t("filters.all")}
        </Button>
        <Button
          variant={filter === "unread" ? "contained" : "outlined"}
          size="small"
          onClick={() => setFilter("unread")}
          sx={{ borderRadius: 2, textTransform: "none" }}
          color={filter === "unread" ? "primary" : "inherit"}
        >
          {t("filters.unread")}
        </Button>
      </Stack>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => {
            setError(null);
          }}
        >
          {error}
        </Alert>
      )}

      {/* Main List */}
      <Box>{renderContent()}</Box>

      <DeleteNotificationDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
        }}
        onConfirm={() => {
          void handleDeleteConfirm();
        }}
        notificationTitle={deletingNotification?.title ?? ""}
        loading={deleting}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => {
          setToast(prev => ({ ...prev, open: false }));
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => {
            setToast(prev => ({ ...prev, open: false }));
          }}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
