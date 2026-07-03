"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
  Button,
  useTheme,
  useMediaQuery,
  TextField,
  InputAdornment,
  alpha,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  type SelectChangeEvent,
} from "@mui/material";
import { Link } from "@/shared/i18n/routing";
import HistoryIcon from "@mui/icons-material/History";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import FilterListIcon from "@mui/icons-material/FilterList";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CarRepairIcon from "@mui/icons-material/CarRepair";

import { type InspectionSummary, getInspectionHistory } from "@/api-clients/inspections/inspections";
import { logger } from "@/utils/logger";
import { formatUtcDateTime } from "@/utils/dateTime";
import InspectionStatusBadge from "../_components/InspectionStatusBadge";

export default function InspectionHistoryPage() {
  const theme = useTheme();
  const t = useTranslations("dashboardInspector.history");
  const locale = useLocale();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const [allHistory, setAllHistory] = useState<InspectionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Setup debouncing for search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => { clearTimeout(handler); };
  }, [search]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getInspectionHistory();
      setAllHistory(res);
    } catch (err) {
      logger.error("Failed to load inspection history", err);
      setError("Failed to load history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("All");
    setTypeFilter("All");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const filteredItems = useMemo(() => {
    return allHistory.filter(i => {
      // Search
      const q = debouncedSearch.toLowerCase();
      const matchesSearch =
        !q ||
        (i.bookingNumber && i.bookingNumber.toLowerCase().includes(q)) ||
        i.bookingId.toLowerCase().includes(q) ||
        (i.vehicleDisplayName && i.vehicleDisplayName.toLowerCase().includes(q)) ||
        i.status.toLowerCase().includes(q);

      // Status
      const matchesStatus = statusFilter === "All" || i.status === statusFilter;

      // Type
      const matchesType = typeFilter === "All" || i.inspectionType === typeFilter;

      // Date
      let matchesDate = true;
      if (dateFrom && i.submittedAt) {
        if (new Date(i.submittedAt) < new Date(dateFrom)) matchesDate = false;
      }
      if (dateTo && i.submittedAt) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (new Date(i.submittedAt) > toDate) matchesDate = false;
      }

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [allHistory, debouncedSearch, statusFilter, typeFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  
  const paginatedItems = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredItems.slice(startIndex, startIndex + pageSize);
  }, [filteredItems, page, pageSize]);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {t("title")}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {t("description")}
        </Typography>
      </Box>

      {/* Filter Section */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 2,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Stack spacing={2.5}>
          {/* Top Row: Search & Reset */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: "center" }}>
            <Box sx={{ flexGrow: 1, width: "100%" }}>
              <TextField
                fullWidth
                size="small"
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 40,
                    borderRadius: 2,
                    bgcolor: "background.default",
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<RestartAltIcon />}
              onClick={handleResetFilters}
              sx={{ borderRadius: 2, minWidth: { xs: "100%", md: 140 }, height: 40 }}
            >
              {t("filterReset")}
            </Button>
          </Stack>
          
          {/* Bottom Row: Dropdowns */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            {/* Status */}
            <FormControl fullWidth size="small" sx={{ flex: 1 }}>
              <InputLabel id="status-filter-label" sx={{ color: "text.secondary" }}>
                {t("filterStatusLabel")}
              </InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label={t("filterStatusLabel")}
                onChange={(e: SelectChangeEvent) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon sx={{ color: "text.secondary", fontSize: 18, ml: 1 }} />
                  </InputAdornment>
                }
                sx={{ borderRadius: 2, bgcolor: "background.default", height: 40 }}
              >
                <MenuItem value="All">{t("filterAllStatuses")}</MenuItem>
                <MenuItem value="Approved">{t("status.approved")}</MenuItem>
                <MenuItem value="Rejected">{t("status.rejected")}</MenuItem>
                <MenuItem value="Pending">{t("status.pending")}</MenuItem>
              </Select>
            </FormControl>

            {/* Type */}
            <FormControl fullWidth size="small" sx={{ flex: 1 }}>
              <InputLabel id="type-filter-label" sx={{ color: "text.secondary" }}>
                {t("filterTypeLabel")}
              </InputLabel>
              <Select
                labelId="type-filter-label"
                id="type-filter"
                value={typeFilter}
                label={t("filterTypeLabel")}
                onChange={(e: SelectChangeEvent) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon sx={{ color: "text.secondary", fontSize: 18, ml: 1 }} />
                  </InputAdornment>
                }
                sx={{ borderRadius: 2, bgcolor: "background.default", height: 40 }}
              >
                <MenuItem value="All">{t("filterAllTypes")}</MenuItem>
                <MenuItem value="Pickup">{t("typePickup")}</MenuItem>
                <MenuItem value="Return">{t("typeReturn")}</MenuItem>
                <MenuItem value="Routine">{t("typeRoutine")}</MenuItem>
              </Select>
            </FormControl>

            {/* Date From */}
            <TextField
              type="date"
              size="small"
              fullWidth
              label={t("filterDateFrom")}
              value={dateFrom}
              onChange={e => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  height: 40,
                  borderRadius: 2,
                  bgcolor: "background.default",
                },
              }}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />

            {/* Date To */}
            <TextField
              type="date"
              size="small"
              fullWidth
              label={t("filterDateTo")}
              value={dateTo}
              onChange={e => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  height: 40,
                  borderRadius: 2,
                  bgcolor: "background.default",
                },
              }}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Stack>
        </Stack>
      </Paper>

      {/* Error State */}
      {error && !loading && (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "error.main",
            bgcolor: alpha(theme.palette.error.main, 0.05),
            textAlign: "center",
          }}
        >
          <Typography color="error.main">{error}</Typography>
          <Button variant="outlined" color="error" sx={{ mt: 2 }} onClick={() => { void fetchData(); }}>
            Retry
          </Button>
        </Paper>
      )}

      {/* Loading State */}
      {loading ? (
        <Stack spacing={2}>
          {[1, 2, 3, 4].map(n => (
            <Skeleton key={n} variant="rectangular" height={80} sx={{ borderRadius: 3 }} />
          ))}
        </Stack>
      ) : !error && filteredItems.length === 0 ? (
        // Empty State
        search !== "" || statusFilter !== "All" || typeFilter !== "All" || dateFrom !== "" || dateTo !== "" ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              textAlign: "center",
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {t("noResults.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("noResults.description")}
            </Typography>
          </Paper>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              borderRadius: 3,
              border: "1px dashed",
              borderColor: "divider",
              textAlign: "center",
              bgcolor: "background.paper",
            }}
          >
            <HistoryIcon sx={{ fontSize: 60, mb: 2, color: "text.disabled" }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {t("emptyHistory.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("emptyHistory.description")}
            </Typography>
          </Paper>
        )
      ) : !error && isMobile ? (
        // Mobile View
        <Stack spacing={2}>
          {paginatedItems.map(i => (
            <Paper
              key={i.inspectionId}
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Stack direction="row" sx={{ justifyContent: "space-between", mb: 1.5, alignItems: "center" }}>
                <Typography sx={{ fontWeight: 800, fontSize: "1.1rem" }}>
                  {i.bookingNumber || `BKG-${i.bookingId.split("-")[0].toUpperCase()}`}
                </Typography>
                <InspectionStatusBadge status={i.status} />
              </Stack>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}>
                {i.vehicleDisplayName}
              </Typography>
              <Stack spacing={0.5} sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {i.inspectionType === "Pickup" || i.inspectionType === "CheckOut" ? (
                    <DirectionsCarIcon sx={{ fontSize: 16, color: "status.active.main" }} />
                  ) : (
                    <CarRepairIcon sx={{ fontSize: 16, color: "status.cancelled.main" }} />
                  )}
                  {i.inspectionType === "Pickup" ? t("typePickup") : i.inspectionType === "Return" ? t("typeReturn") : i.inspectionType === "Routine" ? t("typeRoutine") : i.inspectionType || "—"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t("mobileCard.photosCount", { count: i.imageCount })}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {i.submittedAt
                    ? t("mobileCard.submittedAt", { date: formatUtcDateTime(i.submittedAt, locale) })
                    : t("mobileCard.submittedFallback")}
                </Typography>
              </Stack>
              <Button
                component={Link}
                href={`/inspector/inspections/${i.inspectionId}`}
                fullWidth
                variant="outlined"
                startIcon={<VisibilityOutlinedIcon />}
                sx={{ borderRadius: 2, fontWeight: 600 }}
              >
                {t("mobileCard.viewReport")}
              </Button>
            </Paper>
          ))}
        </Stack>
      ) : (
        // Desktop Table
        !error && (
          <Paper sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid", borderColor: "divider", elevation: 0 }}>
            <Table>
              <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                <TableRow
                  sx={{
                    "& .MuiTableCell-head": {
                      fontWeight: 700,
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "text.secondary",
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      py: 1.5,
                    },
                  }}
                >
                  <TableCell>{t("table.booking")}</TableCell>
                  <TableCell>{t("table.vehicle")}</TableCell>
                  <TableCell>{t("table.submittedAt")}</TableCell>
                  <TableCell>{t("filterTypeLabel")}</TableCell>
                  <TableCell>{t("table.photos")}</TableCell>
                  <TableCell>{t("table.status")}</TableCell>
                  <TableCell align="right">
                    {t("table.action")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedItems.map(i => (
                  <TableRow
                    key={i.inspectionId}
                    hover
                    sx={{
                      "& .MuiTableCell-root": { py: 1.75 },
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 800 }}>
                      {i.bookingNumber || `BKG-${i.bookingId.split("-")[0].toUpperCase()}`}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{i.vehicleDisplayName}</TableCell>
                    <TableCell color="text.secondary">
                      {i.submittedAt ? formatUtcDateTime(i.submittedAt, locale) : t("mobileCard.submittedFallback")}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        {i.inspectionType === "Pickup" || i.inspectionType === "CheckOut" ? (
                          <DirectionsCarIcon sx={{ fontSize: 16, color: "status.active.main" }} />
                        ) : (
                          <CarRepairIcon sx={{ fontSize: 16, color: "status.cancelled.main" }} />
                        )}
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {i.inspectionType === "Pickup" ? t("typePickup") : i.inspectionType === "Return" ? t("typeReturn") : i.inspectionType === "Routine" ? t("typeRoutine") : i.inspectionType || "—"}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{i.imageCount}</TableCell>
                    <TableCell>
                      <InspectionStatusBadge status={i.status} />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        component={Link}
                        href={`/inspector/inspections/${i.inspectionId}`}
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityOutlinedIcon />}
                        sx={{
                          borderRadius: 2,
                          fontWeight: 600,
                          px: 2,
                          py: 0.75,
                        }}
                      >
                        {t("table.viewDetails")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <Stack direction="row" sx={{ justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => { setPage(value); }}
            color="primary"
            variant="outlined"
            shape="rounded"
          />
        </Stack>
      )}
    </Box>
  );
}
