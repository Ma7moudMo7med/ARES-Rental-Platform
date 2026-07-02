import { Paper, Box, Grid, useTheme } from "@mui/material";
import { SectionLabel, FieldRow } from "../UserDetailsView";
import BadgeIcon from "@mui/icons-material/Badge";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

interface InspectorDetails {
  employeeCode?: string;
  assignedInspections: number;
  completedInspections: number;
  availability?: string;
}

interface InspectorInformationCardProps {
  inspectorDetails?: InspectorDetails | null;
  t: (key: string) => string;
}

export default function InspectorInformationCard({ inspectorDetails, t }: InspectorInformationCardProps) {
  const theme = useTheme();

  if (!inspectorDetails) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: theme.palette.divider,
        bgcolor: theme.palette.background.paper,
        mb: 2.5,
      }}
    >
      <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: theme.palette.divider }}>
        <SectionLabel>{t("details.inspectorInformation") || "Inspector Information"}</SectionLabel>

        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FieldRow
                icon={<BadgeIcon sx={{ fontSize: 17 }} />}
                label={t("details.employeeCode") || "Employee Code"}
                value={inspectorDetails.employeeCode || "—"}
                accentColor={theme.palette.primary.main}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FieldRow
                icon={<EventAvailableIcon sx={{ fontSize: 17 }} />}
                label={t("details.availability") || "Availability"}
                value={inspectorDetails.availability || "—"}
                accentColor={theme.palette.secondary.main || theme.palette.primary.main}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FieldRow
                icon={<AssignmentIcon sx={{ fontSize: 17 }} />}
                label={t("details.assignedInspections") || "Assigned Inspections"}
                value={inspectorDetails.assignedInspections?.toString() || "0"}
                accentColor={theme.palette.secondary.main || theme.palette.primary.main}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FieldRow
                icon={<AssignmentTurnedInIcon sx={{ fontSize: 17 }} />}
                label={t("details.completedInspections") || "Completed Inspections"}
                value={inspectorDetails.completedInspections?.toString() || "0"}
                accentColor={theme.palette.secondary.main || theme.palette.primary.main}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
}
