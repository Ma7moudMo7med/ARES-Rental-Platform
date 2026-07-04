"use client";

import { Avatar, Box, Button, Card, CardContent, Chip, Stack, Typography, alpha, useTheme } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { useTranslations } from "next-intl";
import DemoDataBadge from "../../_components/DemoDataBadge";

interface PendingAction {
  id: string;
  titleKey: string;
  descriptionKey: string;
  severity: "warning" | "info" | "error";
  actionLabelKey: string;
}

const ACTION_META: Record<PendingAction["severity"], { color: "warning" | "info" | "error"; icon: React.ReactNode }> = {
  warning: { color: "warning", icon: <HourglassTopIcon fontSize="small" /> },
  info: { color: "info", icon: <VerifiedOutlinedIcon fontSize="small" /> },
  error: { color: "error", icon: <PriorityHighIcon fontSize="small" /> },
};

const DEMO_PENDING_ACTION_ITEMS: {
  id: string;
  severity: PendingAction["severity"];
  titleKey: string;
  descriptionKey: string;
  actionLabelKey: string;
}[] = [
  {
    id: "p1",
    severity: "warning",
    titleKey: "vehiclesAwaitingApproval.title",
    descriptionKey: "vehiclesAwaitingApproval.description",
    actionLabelKey: "vehiclesAwaitingApproval.actionLabel",
  },
  {
    id: "p2",
    severity: "error",
    titleKey: "bookingNeedsConfirmation.title",
    descriptionKey: "bookingNeedsConfirmation.description",
    actionLabelKey: "bookingNeedsConfirmation.actionLabel",
  },
  {
    id: "p3",
    severity: "info",
    titleKey: "completeProfile.title",
    descriptionKey: "completeProfile.description",
    actionLabelKey: "completeProfile.actionLabel",
  },
];

export default function PendingActions() {
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
              {t("pendingActions")}
            </Typography>
            <DemoDataBadge />
          </Box>
          <Chip
            label={DEMO_PENDING_ACTION_ITEMS.length.toString()}
            size="small"
            color="warning"
            sx={{ fontWeight: 700, borderRadius: 2 }}
          />
        </Box>

        <Stack spacing={1.5}>
          {DEMO_PENDING_ACTION_ITEMS.map(action => {
            const meta = ACTION_META[action.severity];
            return (
              <Box
                key={action.id}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  p: 1.75,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: alpha(theme.palette[meta.color].main, 0.25),
                  bgcolor: alpha(theme.palette[meta.color].main, 0.05),
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: alpha(theme.palette[meta.color].main, 0.18),
                    color: `${meta.color}.main`,
                  }}
                >
                  {meta.icon}
                </Avatar>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
                    {t(`demoPendingActions.${action.titleKey}`)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.25 }}>
                    {t(`demoPendingActions.${action.descriptionKey}`)}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  color={meta.color}
                  endIcon={<ChevronRightIcon />}
                  disabled
                  sx={{
                    flexShrink: 0,
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: 2,
                  }}
                >
                  {t(`demoPendingActions.${action.actionLabelKey}`)}
                </Button>
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}
