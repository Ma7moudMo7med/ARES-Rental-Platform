"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Box,
  InputAdornment,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useTheme,
  alpha,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CarRepairIcon from "@mui/icons-material/CarRepair";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import type { InspectorTask, InspectionTaskType } from "@/api-clients/inspections/inspections";
import { useRouter } from "@/shared/i18n/routing";
import { parseUtcDate } from "@/utils/dateTime";

type FilterType = "All" | InspectionTaskType;

interface TodaysTasksListProps {
  readonly tasks: InspectorTask[];
  readonly loading: boolean;
}

export default function TodayTasksList({ tasks, loading }: TodaysTasksListProps) {
  const theme = useTheme();
  const t = useTranslations("dashboardInspector.inspections");
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [plateSearch, setPlateSearch] = useState("");

  const FILTER_TABS: readonly { label: string; value: FilterType }[] = [
    { label: t("filters.all"), value: "All" },
    { label: t("filters.checkOuts"), value: "CheckOut" },
    { label: t("filters.checkIns"), value: "CheckIn" },
  ];

  const filteredTasks = useMemo(() => {
    let result = tasks;

    if (activeFilter !== "All") {
      result = result.filter(task => task.inspectionType === activeFilter);
    }

    const trimmedPlate = plateSearch.trim().toUpperCase();
    if (trimmedPlate) {
      result = result.filter(task => task.plateNumber.toUpperCase().includes(trimmedPlate));
    }

    return result;
  }, [tasks, activeFilter, plateSearch]);

  return (
    <Box>
      {/* Search and Filters Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" }, mb: 3 }}
      >
        {/* Filter tabs */}
        <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
          {FILTER_TABS.map(tab => {
            const isActive = activeFilter === tab.value;
            return (
              <Box
                key={tab.value}
                component="button"
                onClick={() => {
                  setActiveFilter(tab.value);
                }}
                sx={{
                  px: 2,
                  py: 0.75,
                  borderRadius: 99,
                  border: "1px solid",
                  borderColor: isActive ? "primary.main" : "divider",
                  bgcolor: isActive ? "primary.main" : "background.paper",
                  color: isActive ? "primary.contrastText" : "text.secondary",
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  boxShadow: isActive ? theme.palette.shadow.button : "none",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: isActive ? "primary.main" : alpha(theme.palette.primary.main, 0.06),
                    color: isActive ? "primary.contrastText" : "primary.main",
                  },
                }}
              >
                {tab.label}
              </Box>
            );
          })}
        </Stack>

        {/* Plate number search */}
        <TextField
          id="plate-search"
          placeholder={t("searchPlaceholder")}
          value={plateSearch}
          onChange={e => {
            setPlateSearch(e.target.value);
          }}
          size="small"
          sx={{ minWidth: { xs: "100%", sm: 260 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            },
          }}
          aria-label={t("searchAriaLabel")}
        />
      </Stack>

      {/* Task list */}
      {loading ? (
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
      ) : filteredTasks.length === 0 ? (
        <EmptyState hasSearch={plateSearch.length > 0 || activeFilter !== "All"} />
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: 2,
            border: "1px solid",
            borderColor: theme.palette.border.main,
            boxShadow: theme.palette.shadow.card,
          }}
        >
          <Table sx={{ minWidth: 800 }} aria-label="today's tasks table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ color: "text.secondary", fontWeight: "600", borderBottom: "2px solid", borderColor: "divider" }}
                >
                  {t("table.time", { fallback: "Time" })}
                </TableCell>
                <TableCell
                  sx={{ color: "text.secondary", fontWeight: "600", borderBottom: "2px solid", borderColor: "divider" }}
                >
                  {t("table.vehicle", { fallback: "Vehicle" })}
                </TableCell>
                <TableCell
                  sx={{ color: "text.secondary", fontWeight: "600", borderBottom: "2px solid", borderColor: "divider" }}
                >
                  {t("table.customer", { fallback: "Customer" })}
                </TableCell>
                <TableCell
                  sx={{ color: "text.secondary", fontWeight: "600", borderBottom: "2px solid", borderColor: "divider" }}
                >
                  {t("table.inspectionType", { fallback: "Inspection Type" })}
                </TableCell>
                <TableCell
                  sx={{ color: "text.secondary", fontWeight: "600", borderBottom: "2px solid", borderColor: "divider" }}
                >
                  {t("table.status", { fallback: "Status" })}
                </TableCell>
                <TableCell
                  sx={{ color: "text.secondary", fontWeight: "600", borderBottom: "2px solid", borderColor: "divider" }}
                >
                  {t("table.quickActions", { fallback: "Quick Actions" })}
                </TableCell>
                <TableCell
                  sx={{
                    color: "text.secondary",
                    fontWeight: "600",
                    borderBottom: "2px solid",
                    borderColor: "divider",
                    textAlign: "right",
                  }}
                >
                  {t("table.action", { fallback: "Action" })}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.map(task => {
                const isCheckOut = task.inspectionType === "CheckOut";
                const TypeIcon = isCheckOut ? DirectionsCarIcon : CarRepairIcon;
                const accentColor = isCheckOut ? theme.palette.status.active.main : theme.palette.status.cancelled.main;

                const scheduledDate = parseUtcDate(task.scheduledTime);
                const formattedTime = scheduledDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                const mapsHref = task.address
                  ? `https://maps.google.com/maps?q=${encodeURIComponent(task.address)}`
                  : `https://maps.google.com/maps?q=${encodeURIComponent(task.vehicleName)}`;

                const isCompleted = task.status === "Completed" || task.status?.toLowerCase() === "completed";
                const statusColor = isCompleted
                  ? theme.palette.status.completed.main
                  : theme.palette.status.pending.main;

                return (
                  <TableRow key={task.inspectionId} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell sx={{ fontWeight: "600", whiteSpace: "nowrap" }}>{formattedTime}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {task.vehicleName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          {task.plateNumber || "—"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{task.customerName}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <TypeIcon sx={{ fontSize: 16, color: accentColor }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: accentColor }}>
                          {isCheckOut ? t("card.checkOutBadge") : t("card.checkInBadge")}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.status || t("status.pending", { fallback: "Pending" })}
                        size="small"
                        sx={{
                          fontWeight: "700",
                          borderRadius: 2,
                          bgcolor: alpha(statusColor, 0.12),
                          color: statusColor,
                          "& .MuiChip-label": { px: 2 },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title={t("card.callTooltip", { customerName: task.customerName })} arrow>
                          <IconButton
                            component="a"
                            href={`tel:${task.customerPhone}`}
                            onClick={e => e.stopPropagation()}
                            size="small"
                            sx={{
                              bgcolor: alpha(theme.palette.icon.phone.color, 0.1),
                              color: theme.palette.icon.phone.color,
                              border: "1px solid",
                              borderColor: alpha(theme.palette.icon.phone.color, 0.2),
                              "&:hover": { bgcolor: alpha(theme.palette.icon.phone.color, 0.18) },
                              width: 36,
                              height: 36,
                            }}
                            aria-label={t("card.callAriaLabel", { customerName: task.customerName })}
                          >
                            <PhoneIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title={t("card.mapsTooltip")} arrow>
                          <IconButton
                            component="a"
                            href={mapsHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            size="small"
                            sx={{
                              bgcolor: alpha(theme.palette.info.main, 0.1),
                              color: theme.palette.info.main,
                              border: "1px solid",
                              borderColor: alpha(theme.palette.info.main, 0.2),
                              "&:hover": { bgcolor: alpha(theme.palette.info.main, 0.18) },
                              width: 36,
                              height: 36,
                            }}
                            aria-label={t("card.mapsAriaLabel")}
                          >
                            <PlaceIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={e => {
                          e.stopPropagation();
                          router.push(`/inspector/inspections/${task.inspectionId}`);
                        }}
                        sx={{
                          textTransform: "none",
                          fontWeight: 700,
                          px: 2,
                          borderRadius: 2,
                          boxShadow: theme.palette.shadow.button,
                          bgcolor: isCompleted ? "background.paper" : "primary.main",
                          color: isCompleted ? "text.primary" : "primary.contrastText",
                          border: isCompleted ? "1px solid" : "none",
                          borderColor: "divider",
                          "&:hover": {
                            bgcolor: isCompleted ? "action.hover" : "primary.dark",
                          },
                        }}
                      >
                        {isCompleted
                          ? t("card.view", { fallback: "View" })
                          : t("card.startInspection", { fallback: "Start Inspection" })}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

function EmptyState({ hasSearch }: { readonly hasSearch: boolean }) {
  const t = useTranslations("dashboardInspector.inspections");
  return (
    <Paper
      elevation={0}
      sx={{
        textAlign: "center",
        py: 4,
        borderRadius: 3,
        border: "1px dashed",
        borderColor: "divider",
        bgcolor: "background.default",
      }}
    >
      <AssignmentIcon sx={{ fontSize: 56, mb: 2, color: "text.disabled" }} />
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {hasSearch ? t("emptyState.noMatchingTasks") : t("emptyState.allCaughtUp")}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {hasSearch ? t("emptyState.adjustFilter") : t("emptyState.noPendingTasks")}
      </Typography>
    </Paper>
  );
}
