"use client";

import { useState, useMemo, type JSX } from "react";
import { useTranslations } from "next-intl";
import {
  Box,
  Typography,
  Stack,
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  CircularProgress,
  useTheme,
  alpha,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import RefreshIcon from "@mui/icons-material/Refresh";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import EngineeringIcon from "@mui/icons-material/Engineering";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import {
  assignInspectorToBooking,
  getPendingAssignments,
  type PendingAssignment,
} from "@/api-clients/inspections/inspections";
import { type Inspector } from "@/api-clients/inspectors/inspectors";
import StatCard from "@/app/[locale]/(dashboard)/_components/StatCard";

interface Props {
  readonly initialAssignments: PendingAssignment[];
  readonly inspectors: Inspector[];
}

export default function AssignmentCenterClient({ initialAssignments, inspectors }: Props): JSX.Element {
  const theme = useTheme();
  const t = useTranslations("dashboardAdmin.assignmentCenter");

  const [assignments, setAssignments] = useState<PendingAssignment[]>(initialAssignments);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  // Assignment states map (bookingId -> inspectorId, assigning boolean)
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [assigningIds, setAssigningIds] = useState<Record<string, boolean>>({});

  const pendingPickups = assignments.filter(a => a.inspectionType === "Pickup").length;
  const pendingReturns = assignments.filter(a => a.inspectionType === "Return").length;
  const availableInspectors = inspectors.length;

  const handleRefresh = async () => {
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const data = await getPendingAssignments();
      setAssignments(data || []);
      setSuccessMsg(t("refreshSuccess"));
    } catch (error) {
      setErrorMsg(t("refreshError"));
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (bookingId: string) => {
    const inspectorId = selections[bookingId];
    if (!inspectorId) return;

    setSuccessMsg(null);
    setErrorMsg(null);
    setAssigningIds(prev => ({ ...prev, [bookingId]: true }));
    try {
      await assignInspectorToBooking(bookingId, { inspectorUserId: inspectorId });
      setSuccessMsg(t("assignSuccess"));
      // Remove from table
      setAssignments(prev => prev.filter(a => a.bookingId !== bookingId));
    } catch (error: any) {
      setErrorMsg(error.message || t("assignError"));
    } finally {
      setAssigningIds(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const filteredAssignments = useMemo(() => {
    return assignments.filter(a => {
      const matchesSearch =
        (a.bookingNumber && a.bookingNumber.toLowerCase().includes(search.toLowerCase())) ||
        a.customerName.toLowerCase().includes(search.toLowerCase()) ||
        a.vehicleDisplayName.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "All" || a.inspectionType === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [assignments, search, typeFilter]);

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" color="text.primary" sx={{ fontWeight: 800, mb: 1 }}>
            {t("title")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("description")}
          </Typography>
        </Box>
        <Button
          startIcon={loading ? <CircularProgress size={16} /> : <RefreshIcon />}
          variant="outlined"
          onClick={handleRefresh}
          disabled={loading}
        >
          {t("refresh")}
        </Button>
      </Stack>

      {successMsg && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => {
            setSuccessMsg(null);
          }}
        >
          {successMsg}
        </Alert>
      )}
      {errorMsg && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => {
            setErrorMsg(null);
          }}
        >
          {errorMsg}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
          <StatCard
            title={t("pendingPickups")}
            value={pendingPickups.toString()}
            color="warning"
            icon={<DirectionsCarIcon fontSize="small" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
          <StatCard
            title={t("pendingReturns")}
            value={pendingReturns.toString()}
            color="success"
            icon={<AssignmentReturnIcon fontSize="small" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
          <StatCard
            title={t("availableInspectors")}
            value={availableInspectors.toString()}
            color="info"
            icon={<EngineeringIcon fontSize="small" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
          <StatCard
            title={t("totalPending")}
            value={assignments.length.toString()}
            color="primary"
            icon={<PendingActionsIcon fontSize="small" />}
          />
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
        <Grid container spacing={2} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={e => {
                setSearch(e.target.value);
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t("inspectionType")}</InputLabel>
              <Select
                value={typeFilter}
                label={t("inspectionType")}
                onChange={e => {
                  setTypeFilter(e.target.value);
                }}
              >
                <MenuItem value="All">{t("all")}</MenuItem>
                <MenuItem value="Pickup">{t("pickup")}</MenuItem>
                <MenuItem value="Return">{t("return")}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
      >
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>{t("bookingNumber")}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{t("customer")}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{t("vehicle")}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{t("type")}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{t("date")}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{t("currentInspector")}</TableCell>
              <TableCell sx={{ fontWeight: 600, width: "300px" }}>{t("action")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    {t("noPendingAssignments")}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredAssignments.map(row => (
                <TableRow key={`${row.bookingId}-${row.inspectionType}`} hover>
                  <TableCell>{row.bookingNumber || "N/A"}</TableCell>
                  <TableCell>{row.customerName}</TableCell>
                  <TableCell>{row.vehicleDisplayName}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.inspectionType === "Pickup" ? t("pickup") : t("return")}
                      size="small"
                      sx={{
                        bgcolor:
                          row.inspectionType === "Pickup"
                            ? alpha(theme.palette.status.pending.main, 0.15)
                            : alpha(theme.palette.status.active.main, 0.15),
                        color:
                          row.inspectionType === "Pickup"
                            ? theme.palette.status.pending.main
                            : theme.palette.status.active.main,
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>{new Date(row.inspectionDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                      {t("notAssigned")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <FormControl size="small" sx={{ minWidth: 160 }}>
                        <Select
                          displayEmpty
                          value={selections[row.bookingId] || ""}
                          onChange={e => {
                            setSelections(prev => ({ ...prev, [row.bookingId]: e.target.value }));
                          }}
                          renderValue={selected => {
                            if (!selected)
                              return (
                                <Typography variant="body2" color="text.secondary">
                                  {t("selectInspector")}
                                </Typography>
                              );
                            const insp = inspectors.find(i => i.userId === selected);
                            return (
                              <Typography variant="body2">
                                {insp ? `${insp.firstName} ${insp.lastName}` : t("unknown")}
                              </Typography>
                            );
                          }}
                        >
                          <MenuItem disabled value="">
                            {t("selectInspector")}
                          </MenuItem>
                          {inspectors.map(insp => (
                            <MenuItem key={insp.userId} value={insp.userId}>
                              {insp.firstName} {insp.lastName} - {insp.employeeCode}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={
                          assigningIds[row.bookingId] ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            <AssignmentIndIcon />
                          )
                        }
                        disabled={!selections[row.bookingId] || assigningIds[row.bookingId]}
                        onClick={() => handleAssign(row.bookingId)}
                      >
                        {t("assign")}
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
