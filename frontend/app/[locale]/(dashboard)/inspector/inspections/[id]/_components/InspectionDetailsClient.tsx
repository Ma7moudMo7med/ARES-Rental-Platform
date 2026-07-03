"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type JSX } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  CircularProgress,
  Alert,
  Divider,
  TextField,
  Snackbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
  Slider,
  InputAdornment,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useRouter } from "@/shared/i18n/routing";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { formatUtcDateTime } from "@/utils/dateTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LockIcon from "@mui/icons-material/Lock";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import SpeedIcon from "@mui/icons-material/Speed";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  getInspectionDetails,
  submitInspection,
  uploadInspectionImages,
  type InspectionDetails,
} from "@/api-clients/inspections/inspections";
import { ApiError } from "@/utils/api-client";
import { toImageUrl } from "@/utils/image-url";
import { logger } from "@/utils/logger";
import InspectionStatusBadge from "../../../_components/InspectionStatusBadge";

interface Props {
  readonly inspectionId: string;
}

interface PendingImage {
  readonly id: string;
  readonly file: File;
  readonly previewUrl: string;
}

const MAX_IMAGES = 5;
const MIN_IMAGES = 1;

export default function InspectionDetailsClient({ inspectionId }: Props): JSX.Element {
  const router = useRouter();
  const t = useTranslations("dashboardInspector.inspectionDetail");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [details, setDetails] = useState<InspectionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [notes, setNotes] = useState("");
  const [generalCondition, setGeneralCondition] = useState("");
  const [odometerReading, setOdometerReading] = useState<number | "">("");
  const [fuelLevel, setFuelLevel] = useState<number>(100);
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState<{ readonly open: boolean; readonly severity: "success" | "error"; readonly message: string }>({
    open: false,
    severity: "success",
    message: "",
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getInspectionDetails(inspectionId);
      setDetails(data);
      setNotes(data.notes ?? "");
      setGeneralCondition(data.generalCondition ?? "");
      setOdometerReading(data.odometerReading);
      setFuelLevel(data.fuelLevel);
      if (data.isSubmitted) {
        setDecision(data.status === "Approved" ? "approve" : data.status === "Rejected" ? "reject" : null);
      }
    } catch (err) {
      logger.error("Failed to load inspection", err);
      if (err instanceof ApiError && err.status === 403) {
        setLoadError(t("errors.accessDenied"));
      } else if (err instanceof ApiError && err.status === 404) {
        setLoadError(t("errors.notFound"));
      } else {
        setLoadError(t("errors.failedToLoad"));
      }
    } finally {
      setLoading(false);
    }
  }, [inspectionId, t]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  useEffect(() => {
    return () => {
      pendingImages.forEach(p => {
        URL.revokeObjectURL(p.previewUrl);
      });
    };
  }, [pendingImages]);

  const isLocked = details?.isSubmitted ?? false;
  const totalImageCount = (details?.images.length ?? 0) + pendingImages.length;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const remainingSlots = MAX_IMAGES - totalImageCount;
    if (remainingSlots <= 0) {
      setToast({ open: true, severity: "error", message: t("errors.maxImages", { max: MAX_IMAGES }) });
      event.target.value = "";
      return;
    }

    const accepted = files.slice(0, remainingSlots).map(file => ({
      id: `${file.name}-${String(Date.now())}-${self.crypto.randomUUID()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setPendingImages(prev => [...prev, ...accepted]);
    setValidationErrors(prev => {
      const next = { ...prev };
      delete next.images;
      return next;
    });
    event.target.value = "";
  };

  const removePending = (id: string) => {
    setPendingImages(prev => {
      const target = prev.find(p => p.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter(p => p.id !== id);
    });
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!decision) errors.decision = t("errors.selectDecision");
    if (!notes.trim()) errors.notes = t("errors.provideNotes");
    if (odometerReading === "" || odometerReading < 0) errors.odometerReading = t("errors.enterOdometer");
    if (totalImageCount < MIN_IMAGES) errors.images = t("errors.photoRequired", { min: MIN_IMAGES });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmSubmit = () => {
    if (validate()) setConfirmOpen(true);
  };

  const handleSubmit = async () => {
    setConfirmOpen(false);
    setSubmitting(true);

    try {
      if (pendingImages.length > 0) {
        await uploadInspectionImages(
          inspectionId,
          pendingImages.map(p => p.file)
        );
      }

      await submitInspection(inspectionId, {
        notes,
        generalCondition: generalCondition.trim() ? generalCondition : undefined,
        odometerReading: typeof odometerReading === "number" ? odometerReading : undefined,
        fuelLevel,
        approve: decision === "approve",
      });

      setToast({ open: true, severity: "success", message: t("success.submitted") });
      void fetchData();
    } catch (err) {
      logger.error("Failed to submit inspection", err);
      const msg = err instanceof Error ? err.message : t("errors.submitFailed");
      setToast({ open: true, severity: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const allImages = useMemo(() => {
    const existing = (details?.images ?? []).map(img => ({
      id: img.id,
      src: toImageUrl(img.imageUrl),
      isPending: false,
    }));
    const pending = pendingImages.map(p => ({
      id: p.id,
      src: p.previewUrl,
      isPending: true,
    }));
    return [...existing, ...pending];
  }, [details, pendingImages]);

  if (loading && !details) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 12 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (loadError) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert
          severity="error"
          variant="filled"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                router.back();
              }}
            >
              {t("actions.goBack")}
            </Button>
          }
        >
          {loadError}
        </Alert>
      </Box>
    );
  }

  if (!details) return <Box>{t("labels.notFound")}</Box>;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3 }, py: { xs: 2, md: 3 } }}>
      {/* Header section */}
      <Stack spacing={1.5} sx={{ mb: 2 }}>
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => {
              router.back();
            }}
            color="inherit"
            sx={{ textTransform: "none", fontWeight: 600, color: "text.secondary", "&:hover": { color: "text.primary", bgcolor: "transparent" } }}
          >
            {t("actions.goBack")}
          </Button>
        </Box>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {t("labels.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("labels.subtitle", { bookingNumber: details.bookingNumber ?? "" })}
            </Typography>
          </Box>
        </Stack>
      </Stack>

      {/* Locked Alert if inspection is already submitted */}
      {isLocked && (
        <Alert icon={<LockIcon />} severity="info" sx={{ borderRadius: 3, mb: 3 }}>
          {t("labels.lockedAlert")}
        </Alert>
      )}

      <Stack spacing={2}>
        {/* 1. Booking Information */}
        <BookingInfoSection details={details} />

        {/* 2. Vehicle Metrics */}
        <VehicleMetricsSection
          isLocked={isLocked}
          submitting={submitting}
          odometerReading={odometerReading}
          setOdometerReading={setOdometerReading}
          fuelLevel={fuelLevel}
          setFuelLevel={setFuelLevel}
          validationErrors={validationErrors}
        />

        {/* 3. Inspection Evidence */}
        <VisualEvidenceSection
          isLocked={isLocked}
          submitting={submitting}
          totalImageCount={totalImageCount}
          fileInputRef={fileInputRef}
          handleFileSelect={handleFileSelect}
          allImages={allImages}
          removePending={removePending}
          validationErrors={validationErrors}
        />

        {/* 4. Condition Report */}
        <ConditionReportSection
          isLocked={isLocked}
          submitting={submitting}
          generalCondition={generalCondition}
          setGeneralCondition={setGeneralCondition}
          notes={notes}
          setNotes={setNotes}
          validationErrors={validationErrors}
        />

        {/* 5. Final Decision */}
        <FinalDecisionSection
          isLocked={isLocked}
          submitting={submitting}
          decision={decision}
          setDecision={setDecision}
          validationErrors={validationErrors}
        />

        {/* 6. Submit Final Report */}
        {!isLocked && (
          <SubmitSection
            submitting={submitting}
            handleConfirmSubmit={handleConfirmSubmit}
          />
        )}
      </Stack>

      <Dialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
        }}
        sx={{ "& .MuiDialog-paper": { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>{t("labels.dialogTitle")}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="text.secondary">
            {t.rich("labels.dialogText", {
              decision: decision === "approve" ? t("actions.approveVehicle") : t("actions.rejectVehicle"),
              bold: chunks => <strong>{chunks}</strong>,
            })}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => {
              setConfirmOpen(false);
            }}
            color="inherit"
            sx={{ fontWeight: 600 }}
          >
            {t("actions.cancel")}
          </Button>
          <Button
            onClick={() => {
              void handleSubmit();
            }}
            variant="contained"
            color="primary"
            sx={{ fontWeight: 700, borderRadius: 2, px: 3 }}
          >
            {t("actions.confirmSubmit")}
          </Button>
        </DialogActions>
      </Dialog>

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
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

interface InfoRowProps {
  readonly label: string;
  readonly value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontWeight: 600, display: "block", mb: 0.25, textTransform: "uppercase", letterSpacing: 0.5 }}
      >
        {label}
      </Typography>
      <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </Box>
  );
}

interface BookingInfoSectionProps {
  readonly details: InspectionDetails;
}

function BookingInfoSection({ details }: BookingInfoSectionProps) {
  const t = useTranslations("dashboardInspector.inspectionDetail");
  const locale = useLocale();
  const theme = useTheme();

  const isPickup = details.inspectionType?.toLowerCase() === "pickup" || details.inspectionType === "CheckOut";
  const typeLabel = isPickup ? t("labels.pickupInspection") : t("labels.returnInspection");
  const typeBg = isPickup ? alpha(theme.palette.status.confirmed.main, 0.15) : alpha(theme.palette.status.completed.main, 0.15);
  const typeColor = isPickup ? theme.palette.status.confirmed.main : theme.palette.status.completed.main;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: theme.shadows[1],
      }}
    >
      <Grid container spacing={2} sx={{ alignItems: "center" }}>
        <Grid size={{ xs: 12, md: 9 }}>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <InfoRow label={t("labels.bookingNumber")} value={details.bookingNumber || "—"} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <InfoRow label={t("labels.customer")} value={details.customerName || "—"} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <InfoRow label={t("labels.vehicle")} value={details.vehicleDisplayName || "—"} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <InfoRow label={t("labels.inspectionType")} value={typeLabel} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <InfoRow label={t("labels.scheduledDateTime")} value={formatUtcDateTime(details.inspectionDate, locale)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <InfoRow label={t("labels.assignedInspector")} value={details.inspectorFullName || "—"} />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }} sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "flex-start", md: "flex-end" }, gap: 1.5 }}>
          <Chip
            label={typeLabel}
            sx={{
              bgcolor: typeBg,
              color: typeColor,
              fontWeight: 800,
              px: 1,
              borderRadius: 2,
              height: 32,
              fontSize: "0.85rem",
            }}
          />
          <InspectionStatusBadge status={details.status} size="medium" />
        </Grid>
      </Grid>
    </Paper>
  );
}

interface VehicleMetricsSectionProps {
  readonly isLocked: boolean;
  readonly submitting: boolean;
  readonly odometerReading: number | "";
  readonly setOdometerReading: (val: number | "") => void;
  readonly fuelLevel: number;
  readonly setFuelLevel: (val: number) => void;
  readonly validationErrors: Record<string, string>;
}

function VehicleMetricsSection({
  isLocked,
  submitting,
  odometerReading,
  setOdometerReading,
  fuelLevel,
  setFuelLevel,
  validationErrors,
}: VehicleMetricsSectionProps) {
  const t = useTranslations("dashboardInspector.inspectionDetail");
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: theme.shadows[1],
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
        {t("labels.vehicleMetrics")}
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            {t("labels.odometerReading")}
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="number"
            placeholder={t("labels.odometerPlaceholder")}
            value={odometerReading}
            onChange={e => {
              const val = e.target.value;
              setOdometerReading(val === "" ? "" : Number(val));
            }}
            disabled={isLocked || submitting}
            error={!!validationErrors.odometerReading}
            helperText={validationErrors.odometerReading}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SpeedIcon color={isLocked ? "disabled" : "primary"} fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">{t("labels.odometerUnit")}</InputAdornment>,
                sx: { borderRadius: 2 },
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            {t("labels.fuelLevel", { level: fuelLevel })}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: 40,
              px: 1.5,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              bgcolor: isLocked ? "action.disabledBackground" : "transparent",
            }}
          >
            <LocalGasStationIcon color={isLocked ? "disabled" : "primary"} fontSize="small" sx={{ mr: 1.5 }} />
            <Slider
              value={fuelLevel}
              min={0}
              max={100}
              step={5}
              marks={[
                { value: 0, label: t("labels.fuelMarksE") },
                { value: 25 },
                { value: 50, label: t("labels.fuelMarksHalf") },
                { value: 75 },
                { value: 100, label: t("labels.fuelMarksF") },
              ]}
              onChange={(_, newVal) => {
                if (typeof newVal === "number") setFuelLevel(newVal);
              }}
              disabled={isLocked || submitting}
              sx={{ mx: 2 }}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

interface VisualEvidenceSectionProps {
  readonly isLocked: boolean;
  readonly submitting: boolean;
  readonly totalImageCount: number;
  readonly fileInputRef: React.RefObject<HTMLInputElement | null>;
  readonly handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly allImages: readonly { readonly id: string; readonly src: string | undefined; readonly isPending: boolean }[];
  readonly removePending: (id: string) => void;
  readonly validationErrors: Record<string, string>;
}

function VisualEvidenceSection({
  isLocked,
  submitting,
  totalImageCount,
  fileInputRef,
  handleFileSelect,
  allImages,
  removePending,
  validationErrors,
}: VisualEvidenceSectionProps) {
  const t = useTranslations("dashboardInspector.inspectionDetail");
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: theme.shadows[1],
      }}
    >
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          {t("labels.visualEvidence", { count: totalImageCount, max: MAX_IMAGES })}
        </Typography>
        {!isLocked && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddPhotoAlternateIcon />}
            onClick={() => {
              fileInputRef.current?.click();
            }}
            disabled={totalImageCount >= MAX_IMAGES || submitting}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            {t("actions.uploadPhotos")}
          </Button>
        )}
      </Stack>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />

      {allImages.length === 0 ? (
        <Box
          sx={{
            border: "2px dashed",
            borderColor: validationErrors.images ? "error.main" : "divider",
            borderRadius: 3,
            p: 4,
            textAlign: "center",
            cursor: isLocked ? "default" : "pointer",
            bgcolor: alpha(theme.palette.background.default, 0.5),
            transition: "all 0.2s",
            "&:hover": { bgcolor: isLocked ? "inherit" : "action.hover" },
          }}
          onClick={() => {
            if (!isLocked) fileInputRef.current?.click();
          }}
        >
          <AddPhotoAlternateIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {isLocked ? t("labels.noPhotos") : t("labels.uploadTitle")}
          </Typography>
          {!isLocked && (
            <Typography variant="body2" color="text.secondary">
              {t("labels.uploadSubtitle", { min: MIN_IMAGES, max: MAX_IMAGES })}
            </Typography>
          )}
        </Box>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(5, 1fr)" }, gap: 2 }}>
          {allImages.map(img => (
            <Box
              key={img.id}
              sx={{
                position: "relative",
                aspectRatio: "1 / 1",
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.default",
                  boxShadow: theme.shadows[1],
                }}
              >
                {img.src && (
                  <Box
                    component="img"
                    src={img.src}
                    alt={t("labels.imageAltText")}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
                {img.isPending && !isLocked && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      removePending(img.id);
                    }}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: alpha(theme.palette.error.main, 0.9),
                      color: theme.palette.error.contrastText,
                      backdropFilter: "blur(4px)",
                      "&:hover": { bgcolor: theme.palette.error.main, transform: "scale(1.1)" },
                      transition: "all 0.2s",
                    }}
                  >
                    <DeleteOutlinedIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
          ))}
        </Box>
      )}

      {/* Validation Errors & Photo Stats */}
      <Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", mt: 2, gap: 1, alignItems: { sm: "center" } }}>
        <Box>
          <Typography variant="subtitle2" color="text.primary" sx={{ display: "block", fontWeight: 800 }}>
            {totalImageCount} / {MAX_IMAGES} {t("labels.photoCount")}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
            {t("labels.minPhotos", { min: MIN_IMAGES })} | {t("labels.maxPhotos", { max: MAX_IMAGES })}
          </Typography>
        </Box>
        {validationErrors.images && (
          <Typography variant="caption" color="error" sx={{ fontWeight: 600, alignSelf: "flex-end" }}>
            {validationErrors.images}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

interface ConditionReportSectionProps {
  readonly isLocked: boolean;
  readonly submitting: boolean;
  readonly generalCondition: string;
  readonly setGeneralCondition: (val: string) => void;
  readonly notes: string;
  readonly setNotes: (val: string) => void;
  readonly validationErrors: Record<string, string>;
}

function ConditionReportSection({
  isLocked,
  submitting,
  generalCondition,
  setGeneralCondition,
  notes,
  setNotes,
  validationErrors,
}: ConditionReportSectionProps) {
  const t = useTranslations("dashboardInspector.inspectionDetail");
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: theme.shadows[1],
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
        {t("labels.conditionTitle")}
      </Typography>

      <Stack spacing={2}>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "primary.main", mb: 1 }}>
            {t("labels.damageReportTitle")}
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={2}
            placeholder={t("labels.damagePlaceholder")}
            value={generalCondition}
            onChange={e => {
              setGeneralCondition(e.target.value);
            }}
            disabled={isLocked || submitting}
            slotProps={{ input: { sx: { borderRadius: 2 } } }}
          />
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "primary.main", mb: 1 }}>
            {t("labels.finalNotesTitle")}
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={2}
            placeholder={t("labels.finalNotesPlaceholder")}
            value={notes}
            onChange={e => {
              setNotes(e.target.value);
            }}
            disabled={isLocked || submitting}
            error={!!validationErrors.notes}
            helperText={validationErrors.notes}
            slotProps={{ input: { sx: { borderRadius: 2 } } }}
          />
        </Box>
      </Stack>
    </Paper>
  );
}

interface FinalDecisionSectionProps {
  readonly isLocked: boolean;
  readonly submitting: boolean;
  readonly decision: "approve" | "reject" | null;
  readonly setDecision: (val: "approve" | "reject") => void;
  readonly validationErrors: Record<string, string>;
}

interface DecisionButtonProps {
  readonly type: "approve" | "reject";
  readonly selected: boolean;
  readonly disabled: boolean;
  readonly onClick: () => void;
  readonly label: string;
}

function DecisionButton({ type, selected, disabled, onClick, label }: DecisionButtonProps) {
  const theme = useTheme();
  const color = type === "approve" ? "success.main" : "error.main";
  const paletteColor = type === "approve" ? theme.palette.success.main : theme.palette.error.main;
  const Icon = type === "approve" ? CheckCircleIcon : CancelIcon;

  return (
    <Box
      onClick={() => {
        if (!disabled) onClick();
      }}
      sx={{
        p: 1.5,
        borderRadius: 3,
        border: "2px solid",
        borderColor: selected ? color : "divider",
        bgcolor: selected ? alpha(paletteColor, 0.12) : "transparent",
        boxShadow: selected ? `0 4px 12px ${alpha(paletteColor, 0.2)}` : "none",
        cursor: disabled ? "default" : "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.5,
        textAlign: "center",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: disabled ? "divider" : color,
          bgcolor: disabled ? "transparent" : alpha(paletteColor, 0.04),
        },
      }}
    >
      <Icon
        sx={{
          fontSize: 32,
          color: selected ? color : "text.disabled",
        }}
      />
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 800,
          color: selected ? color : "text.primary",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

function FinalDecisionSection({
  isLocked,
  submitting,
  decision,
  setDecision,
  validationErrors,
}: FinalDecisionSectionProps) {
  const t = useTranslations("dashboardInspector.inspectionDetail");
  const theme = useTheme();
  const disabled = isLocked || submitting;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: theme.shadows[1],
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
        {t("labels.finalDecision")}
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <DecisionButton
            type="approve"
            selected={decision === "approve"}
            disabled={disabled}
            onClick={() => { setDecision("approve"); }}
            label={t("actions.approveVehicle")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <DecisionButton
            type="reject"
            selected={decision === "reject"}
            disabled={disabled}
            onClick={() => { setDecision("reject"); }}
            label={t("actions.rejectVehicle")}
          />
        </Grid>
      </Grid>
      {validationErrors.decision && (
        <Typography variant="caption" color="error" sx={{ mt: 2, display: "block", fontWeight: 600 }}>
          {validationErrors.decision}
        </Typography>
      )}
    </Paper>
  );
}

interface SubmitSectionProps {
  readonly submitting: boolean;
  readonly handleConfirmSubmit: () => void;
}

function SubmitSection({ submitting, handleConfirmSubmit }: SubmitSectionProps) {
  const t = useTranslations("dashboardInspector.inspectionDetail");
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: theme.shadows[1],
      }}
    >
      {/* Information Warning Box */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          p: 1.5,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.warning.main, 0.08),
          borderLeft: `4px solid ${theme.palette.warning.main}`,
          mb: 2.5,
          alignItems: "center",
        }}
      >
        <InfoOutlinedIcon color="warning" />
        <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 600 }}>
          {t("labels.submitInfoBox")}
        </Typography>
      </Stack>

      <Button
        fullWidth
        size="large"
        variant="contained"
        color="primary"
        onClick={handleConfirmSubmit}
        disabled={submitting}
        sx={{ py: 1.5, borderRadius: 3, fontWeight: 800, fontSize: "1rem" }}
      >
        {submitting ? <CircularProgress size={26} color="inherit" /> : t("actions.submitFinalReport")}
      </Button>
    </Paper>
  );
}
