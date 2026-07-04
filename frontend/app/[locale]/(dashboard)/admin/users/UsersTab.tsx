"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Stack,
  CircularProgress,
  InputAdornment,
  Pagination,
  Tooltip,
  Card,
  useTheme,
  useMediaQuery,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Divider,
  type Theme,
  type SelectChangeEvent,
  type AlertColor,
} from "@mui/material";

import { useTranslations } from "next-intl";
import { Link } from "@/shared/i18n/routing";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { toggleUserStatus, deleteUser, getUsers, type User } from "@/api-clients/users/users";
import { ApiError } from "@/utils/api-client";
import { logger } from "@/utils/logger";

interface UserMobileCardProps {
  readonly u: User;
  readonly theme: Theme;
  readonly fetchUsers: () => void;
  readonly onRequestDelete: (u: User) => void;
  readonly activeTab: string;
}

function UserMobileCard({ u, theme, fetchUsers, onRequestDelete, activeTab }: UserMobileCardProps) {
  const t = useTranslations("dashboardAdmin.users");
  const status = (u.status || "").toLowerCase();
  const isActive = status === "active";

  const getStatusLabel = useCallback(
    (statusVal: string) => {
      const s = (statusVal || "").toLowerCase();
      if (s === "active" || s === "approved" || s === "verified") return t("details.statusActive");
      if (s === "pending" || s === "pendingverification") return t("details.statusPending");
      if (s === "blocked" || s === "rejected" || s === "suspended") return t("details.statusBlocked");
      return statusVal;
    },
    [t]
  );

  const getAvailabilityLabel = useCallback(
    (avail?: string | null) => {
      if (!avail) return "—";
      const lower = avail.toLowerCase();
      if (lower === "available") return t("details.availabilities.available");
      if (lower === "unavailable") return t("details.availabilities.unavailable");
      if (lower === "reserved") return t("details.availabilities.reserved");
      return avail;
    },
    [t]
  );

  const handleToggleStatus = useCallback(async () => {
    try {
      await toggleUserStatus(u.id);
      fetchUsers();
    } catch (err) {
      logger.error("Failed to toggle user status", err);
    }
  }, [u.id, fetchUsers]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flex: 1, minWidth: 0 }}>
          <Avatar
            src={(u.avatarUrl as string) || undefined}
            sx={{
              bgcolor: theme.palette.primary.light,
              fontWeight: 700,
              width: 40,
              height: 40,
              fontSize: 15,
              flexShrink: 0,
            }}
          >
            {u.firstName[0]}
            {u.lastName[0]}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography noWrap sx={{ fontWeight: 600, fontSize: 14 }}>
              {u.firstName} {u.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
              {u.email}
            </Typography>
          </Box>
        </Stack>

        <Chip
          label={getStatusLabel(status)}
          size="small"
          sx={{
            ml: 1,
            flexShrink: 0,
            textTransform: "capitalize",
            bgcolor: isActive ? alpha(theme.palette.success.main, 0.15) : alpha(theme.palette.error.main, 0.15),
            color: isActive ? theme.palette.success.main : theme.palette.error.main,
            fontWeight: 700,
            fontSize: 11,
          }}
        />
      </Stack>

      {activeTab === "suppliers" ? (
        <Stack spacing={0.5} sx={{ mb: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            {t("table.company")}: <strong>{(u.supplierDetails?.companyName as string) || "—"}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("details.vehiclesCount")}: <strong>{u.supplierDetails?.vehiclesCount ?? 0}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("details.totalBookings")}: <strong>{u.supplierDetails?.totalBookings ?? 0}</strong>
          </Typography>
        </Stack>
      ) : activeTab === "drivers" ? (
        <Stack spacing={0.5} sx={{ mb: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            {t("details.licenseNumber")}: <strong>{(u.driverDetails?.licenseNumber as string) || "—"}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("details.completedTrips")}: <strong>{u.driverDetails?.completedTrips ?? 0}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("details.availability")}: <strong>{getAvailabilityLabel(u.driverDetails?.availability)}</strong>
          </Typography>
        </Stack>
      ) : activeTab === "inspectors" ? (
        <Stack spacing={0.5} sx={{ mb: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            {t("details.employeeCodeLabel")}: <strong>{(u.inspectorDetails?.employeeCode as string) || "—"}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("details.completedInspections")}: <strong>{u.inspectorDetails?.completedInspections ?? 0}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("details.availability")}: <strong>{getAvailabilityLabel(u.inspectorDetails?.availability)}</strong>
          </Typography>
        </Stack>
      ) : activeTab === "users" ? (
        <Stack spacing={0.5} sx={{ mb: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            {t("details.totalBookings")}: <strong>{u.customerDetails?.totalBookings ?? 0}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("details.totalSpent")}:{" "}
            <strong>{u.customerDetails?.totalSpent != null ? `$${u.customerDetails.totalSpent}` : "—"}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("details.lastBookingDate")}: <strong>{(u.customerDetails?.lastBookingDate as string) || "—"}</strong>
          </Typography>
        </Stack>
      ) : (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textTransform: "capitalize", display: "block", mb: 1.5 }}
        >
          {t("details.role")}: <strong>{u.roles.join(", ") || "—"}</strong>
        </Typography>
      )}

      <Stack direction="row" spacing={1}>
        <Tooltip title={t("table.viewDetails")}>
          <IconButton component={Link} href={`/admin/users/${u.id}`} size="small">
            <VisibilityOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title={t("table.editAccount")}>
          <IconButton component={Link} href={`/admin/users/${u.id}/edit`} size="small">
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title={t("table.toggleStatus")}>
          <IconButton
            size="small"
            onClick={() => {
              void handleToggleStatus();
            }}
            sx={{ color: isActive ? "error.main" : "success.main" }}
          >
            {isActive ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        <Tooltip title={t("table.delete")}>
          <IconButton
            size="small"
            onClick={() => {
              onRequestDelete(u);
            }}
            sx={{ color: "error.main" }}
          >
            <DeleteOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Paper>
  );
}

interface UserTableRowProps {
  readonly u: User;
  readonly activeTab: string;
  readonly isActive: boolean;
  readonly handleStatusToggle: (userId: string) => Promise<void>;
  readonly requestDelete: (u: User) => void;
}

function UserTableRow({ u, activeTab, isActive, handleStatusToggle, requestDelete }: UserTableRowProps) {
  const t = useTranslations("dashboardAdmin.users");
  const status = (u.status || "").toLowerCase();

  const getStatusLabel = useCallback(
    (statusVal: string) => {
      const s = (statusVal || "").toLowerCase();
      if (s === "active" || s === "approved" || s === "verified") return t("details.statusActive");
      if (s === "pending" || s === "pendingverification") return t("details.statusPending");
      if (s === "blocked" || s === "rejected" || s === "suspended") return t("details.statusBlocked");
      return statusVal;
    },
    [t]
  );

  const getAvailabilityLabel = useCallback(
    (avail?: string | null) => {
      if (!avail) return "—";
      const lower = avail.toLowerCase();
      if (lower === "available") return t("details.availabilities.available");
      if (lower === "unavailable") return t("details.availabilities.unavailable");
      if (lower === "reserved") return t("details.availabilities.reserved");
      return avail;
    },
    [t]
  );

  return (
    <TableRow
      hover
      sx={{
        transition: "background 0.2s ease",
        "&:last-child td": { border: 0 },
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <TableCell sx={{ pl: 3, py: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Avatar
            src={(u.avatarUrl as string) || undefined}
            sx={{
              bgcolor: theme => alpha(theme.palette.primary.main, 0.08),
              color: "primary.main",
              fontWeight: 700,
              width: 44,
              height: 44,
              fontSize: 16,
            }}
          >
            {u.firstName[0]}
            {u.lastName[0]}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
              {u.firstName} {u.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {u.email}
            </Typography>
          </Box>
        </Stack>
      </TableCell>

      {activeTab === "suppliers" ? (
        <>
          <TableCell sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {(u.supplierDetails?.companyName as string) || "—"}
            </Typography>
          </TableCell>
          <TableCell sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {(u.supplierDetails?.vehiclesCount as number | null | undefined) ?? 0}
            </Typography>
          </TableCell>
          <TableCell sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {(u.supplierDetails?.totalBookings as number | null | undefined) ?? 0}
            </Typography>
          </TableCell>
        </>
      ) : activeTab === "drivers" ? (
        <>
          <TableCell sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {(u.driverDetails?.licenseNumber as string) || "—"}
            </Typography>
          </TableCell>
          <TableCell sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {(u.driverDetails?.completedTrips as number | null | undefined) ?? 0}
            </Typography>
          </TableCell>
          <TableCell sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {getAvailabilityLabel(u.driverDetails?.availability)}
            </Typography>
          </TableCell>
        </>
      ) : activeTab === "inspectors" ? (
        <>
          <TableCell sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {(u.inspectorDetails?.employeeCode as string) || "—"}
            </Typography>
          </TableCell>
          <TableCell sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {(u.inspectorDetails?.completedInspections as number | null | undefined) ?? 0}
            </Typography>
          </TableCell>
          <TableCell sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {getAvailabilityLabel(u.inspectorDetails?.availability)}
            </Typography>
          </TableCell>
        </>
      ) : activeTab === "users" ? (
        <>
          <TableCell sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {(u.customerDetails?.totalBookings as number | null | undefined) ?? 0}
            </Typography>
          </TableCell>
          <TableCell sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {u.customerDetails?.totalSpent != null ? `$${u.customerDetails.totalSpent}` : "—"}
            </Typography>
          </TableCell>
          <TableCell sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {(u.customerDetails?.lastBookingDate as string) || "—"}
            </Typography>
          </TableCell>
        </>
      ) : (
        <>
          <TableCell sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {u.phoneNumber || "—"}
            </Typography>
          </TableCell>
          <TableCell sx={{ py: 2 }}>
            <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }} useFlexGap>
              {u.roles.map(r => (
                <Chip
                  key={r}
                  label={r}
                  size="small"
                  sx={{
                    textTransform: "capitalize",
                    bgcolor: theme => alpha(theme.palette.info.main, 0.1),
                    color: "info.main",
                    fontWeight: 600,
                    fontSize: 12,
                    borderRadius: 1.5,
                  }}
                />
              ))}
              {u.roles.length === 0 && "—"}
            </Stack>
          </TableCell>
        </>
      )}

      <TableCell sx={{ py: 2 }}>
        <Chip
          label={getStatusLabel(status)}
          size="small"
          sx={{
            textTransform: "capitalize",
            borderRadius: 1.5,
            bgcolor: isActive
              ? theme => alpha(theme.palette.success.main, 0.15)
              : theme => alpha(theme.palette.error.main, 0.15),
            color: isActive ? "success.main" : "error.main",
            fontWeight: 600,
            fontSize: 12,
          }}
        />
      </TableCell>

      <TableCell sx={{ py: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {u.createdAt ? new Date(u.createdAt as string).toLocaleDateString() : "—"}
        </Typography>
      </TableCell>

      <TableCell align="right" sx={{ pr: 3, py: 2 }}>
        <Stack direction="row" spacing={0.5} sx={{ justifyContent: "flex-end" }}>
          <Tooltip title={t("table.viewDetails")}>
            <IconButton component={Link} href={`/admin/users/${u.id}`} size="small">
              <VisibilityOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title={t("table.editAccount")}>
            <IconButton
              component={Link}
              href={`/admin/users/${u.id}/edit`}
              size="small"
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title={t("table.toggleStatus")}>
            <IconButton
              size="small"
              onClick={() => {
                void handleStatusToggle(u.id);
              }}
              sx={{ color: isActive ? "error.main" : "success.main" }}
            >
              {isActive ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          <Tooltip title={t("table.delete")}>
            <IconButton
              size="small"
              onClick={() => {
                requestDelete(u);
              }}
              sx={{ color: "error.main" }}
            >
              <DeleteOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}

import type { UserStats } from "@/api-clients/users/users";

interface UsersTabProps {
  activeTab: string;
  onStatsUpdated: (stats: UserStats) => void;
}

export default function UsersTab({ activeTab, onStatsUpdated }: UsersTabProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const t = useTranslations("dashboardAdmin.users");

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const roleMap: Record<string, string> = {
    users: "customer",
    suppliers: "supplier",
    drivers: "driver",
    inspectors: "inspector",
  };

  const [roleFilter, setRoleFilter] = useState(roleMap[activeTab] || "all");

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    setRoleFilter(roleMap[activeTab] || "all");
    setPage(1);
  }, [activeTab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false,
    message: "",
    severity: "success",
  });

  const PAGE_SIZE = 10;

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUsers(page, PAGE_SIZE, {
        searchTerm: debouncedSearch,
        role: roleFilter,
        status: statusFilter,
      });

      const normalized: User[] = data.items.map(u => ({
        ...u,
        status: (u.status || "").toLowerCase(),
        roles: Array.isArray(u.roles)
          ? u.roles.map((r: string) => r.toLowerCase())
          : [((u.roles as string) || "").toLowerCase()],
      }));

      setUsers(normalized);
      setTotalCount(data.totalCount || 0);
      setTotalPages(data.totalPages || 1);

      onStatsUpdated(data.stats);
    } catch (err) {
      logger.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, roleFilter, statusFilter, onStatsUpdated]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const requestDelete = useCallback((u: User) => {
    setDeleteTarget(u);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setDeleting(current => {
      if (!current) setDeleteTarget(null);
      return current;
    });
  }, []);

  const closeToast = useCallback(() => {
    setToast(prev => ({ ...prev, open: false }));
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await deleteUser(deleteTarget.id);
      setToast({
        open: true,
        message: t("alerts.deleteSuccess"),
        severity: "success",
      });
      setDeleteTarget(null);
      await fetchUsers();
    } catch (err) {
      logger.error("Failed to delete user", err);

      let message = t("alerts.deleteError");
      if (err instanceof ApiError) {
        try {
          const parsed = JSON.parse(err.body) as { message?: string };
          if (parsed.message) message = parsed.message;
        } catch {
          if (err.body) message = err.body;
        }
      }
      setToast({ open: true, message, severity: "error" });
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, fetchUsers, t]);

  const handleStatusToggle = useCallback(
    async (userId: string) => {
      try {
        await toggleUserStatus(userId);
        await fetchUsers();
      } catch (err) {
        logger.error("Failed to toggle status", err);
      }
    },
    [fetchUsers]
  );

  const pageData = users;

  return (
    <Box>
      {/* FILTER TOOLBAR */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{
            p: 2,
            bgcolor: "background.paper",
            alignItems: { md: "center" },
          }}
        >
          <TextField
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            size="small"
            sx={{ flexGrow: 1, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.disabled" }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={roleFilter}
              onChange={(e: SelectChangeEvent) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              displayEmpty
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="all">{t("filters.allRoles")}</MenuItem>
              <MenuItem value="admin">{t("form.roles.admin")}</MenuItem>
              <MenuItem value="customer">{t("form.roles.customer")}</MenuItem>
              <MenuItem value="supplier">{t("form.roles.supplier")}</MenuItem>
              <MenuItem value="driver">{t("form.roles.driver")}</MenuItem>
              <MenuItem value="inspector">{t("form.roles.inspector")}</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={statusFilter}
              onChange={(e: SelectChangeEvent) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              displayEmpty
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="all">{t("filters.allStatuses")}</MenuItem>
              <MenuItem value="active">{t("stats.active")}</MenuItem>
              <MenuItem value="blocked">{t("stats.blocked")}</MenuItem>
            </Select>
          </FormControl>

          {/* Empty Space for alignment if needed, or just let Select flex */}
        </Stack>
      </Card>

      {/* TABLE / MOBILE CARDS */}
      {(() => {
        if (loading) {
          return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
              <CircularProgress />
            </Box>
          );
        }

        if (isMobile) {
          return (
            <Box>
              {pageData.length > 0 ? (
                pageData.map(u => (
                  <UserMobileCard
                    key={u.id}
                    u={u}
                    theme={theme}
                    fetchUsers={() => {
                      void fetchUsers();
                    }}
                    onRequestDelete={requestDelete}
                    activeTab={activeTab}
                  />
                ))
              ) : (
                <Box sx={{ py: 8, textAlign: "center", opacity: 0.6 }}>
                  <SearchIcon sx={{ fontSize: 60, mb: 2, color: "text.disabled" }} />
                  <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 700 }}>
                    {t("table.noUsers")}
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    {t("table.noUsersDesc")}
                  </Typography>
                </Box>
              )}
              <Stack direction="column" spacing={1} sx={{ alignItems: "center", mt: 2, mb: 1 }}>
                <Typography variant="caption">
                  {t("table.showingCount", { count: pageData.length, total: totalCount })}
                </Typography>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, v) => {
                    setPage(v);
                  }}
                  size="small"
                  siblingCount={0}
                  boundaryCount={1}
                  sx={{ "& .MuiPaginationItem-root": { borderRadius: 2 } }}
                />
              </Stack>
            </Box>
          );
        }

        return (
          <Card elevation={0} sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 700 }}>
              <Table stickyHeader sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow
                    sx={{
                      "& .MuiTableCell-head": {
                        fontWeight: 700,
                        fontSize: 13,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "text.secondary",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        py: 2.5,
                        bgcolor: t => alpha(t.palette.primary.main, 0.03),
                      },
                    }}
                  >
                    <TableCell sx={{ pl: 3 }}>
                      {activeTab === "suppliers" ? t("table.supplierName") : t("table.user")}
                    </TableCell>
                    {activeTab === "suppliers" ? (
                      <>
                        <TableCell>{t("table.company")}</TableCell>
                        <TableCell>{t("details.vehiclesCount")}</TableCell>
                        <TableCell>{t("details.totalBookings")}</TableCell>
                      </>
                    ) : activeTab === "drivers" ? (
                      <>
                        <TableCell>{t("details.licenseNumber")}</TableCell>
                        <TableCell>{t("details.completedTrips")}</TableCell>
                        <TableCell>{t("details.availability")}</TableCell>
                      </>
                    ) : activeTab === "inspectors" ? (
                      <>
                        <TableCell>{t("details.employeeCode")}</TableCell>
                        <TableCell>{t("details.completedInspections")}</TableCell>
                        <TableCell>{t("details.availability")}</TableCell>
                      </>
                    ) : activeTab === "users" ? (
                      <>
                        <TableCell>{t("details.totalBookings")}</TableCell>
                        <TableCell>{t("details.totalSpent")}</TableCell>
                        <TableCell>{t("details.lastBookingDate")}</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{t("details.phone")}</TableCell>
                        <TableCell>{t("details.role")}</TableCell>
                      </>
                    )}
                    <TableCell>{t("table.status")}</TableCell>
                    <TableCell>{activeTab === "suppliers" ? t("details.joined") : t("table.createdAt")}</TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      {t("table.actions")}
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {pageData.length > 0 ? (
                    pageData.map(u => {
                      const status = (u.status || "").toLowerCase();
                      const isActive = status === "active";
                      return (
                        <UserTableRow
                          key={u.id}
                          u={u}
                          activeTab={activeTab}
                          isActive={isActive}
                          handleStatusToggle={handleStatusToggle}
                          requestDelete={requestDelete}
                        />
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                        <Box sx={{ textAlign: "center", opacity: 0.6 }}>
                          <SearchIcon sx={{ fontSize: 60, mb: 2, color: "text.disabled" }} />
                          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 700 }}>
                            {t("table.noUsers")}
                          </Typography>
                          <Typography variant="body2" color="text.disabled">
                            {t("table.noUsersDesc")}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3} sx={{ pl: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        {t("table.showingCount", { count: pageData.length, total: totalCount })}
                      </Typography>
                    </TableCell>
                    <TableCell colSpan={3} align="right" sx={{ pr: 3 }}>
                      {totalPages > 1 && (
                        <Pagination
                          count={totalPages}
                          page={page}
                          onChange={(_, v) => {
                            setPage(v);
                          }}
                          size="small"
                          sx={{ "& .MuiPaginationItem-root": { borderRadius: 2 } }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Card>
        );
      })()}

      {/* Delete confirmation modal */}
      <Dialog
        open={deleteTarget !== null}
        onClose={closeDeleteDialog}
        maxWidth="xs"
        fullWidth
        aria-labelledby="delete-user-dialog-title"
      >
        <DialogTitle
          id="delete-user-dialog-title"
          sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 700 }}
        >
          <WarningAmberIcon color="error" />
          {t("dialogs.deleteTitle")}
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t("dialogs.deleteConfirmText")}
          </Typography>

          {deleteTarget && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: t => alpha(t.palette.text.primary, 0.02),
              }}
            >
              <Stack spacing={1}>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {t("dialogs.name")}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, textAlign: "right" }}>
                    {deleteTarget.firstName} {deleteTarget.lastName}
                  </Typography>
                </Box>
                <Divider flexItem />
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {t("dialogs.email")}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, textAlign: "right", wordBreak: "break-all" }}>
                    {deleteTarget.email}
                  </Typography>
                </Box>
                <Divider flexItem />
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {t("details.role")}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, textAlign: "right", textTransform: "capitalize" }}>
                    {deleteTarget.roles.join(", ") || "—"}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}

          <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mt: 2 }}>
            {t("dialogs.deleteWarningText")}
          </Alert>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDeleteDialog} disabled={deleting} color="inherit">
            {t("details.cancel")}
          </Button>
          <Button
            onClick={() => {
              void confirmDelete();
            }}
            disabled={deleting}
            variant="contained"
            color="error"
            startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <DeleteOutlinedIcon />}
          >
            {deleting ? t("dialogs.deleting") : t("dialogs.deleteConfirmBtn")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={closeToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={closeToast} severity={toast.severity} variant="filled" sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
