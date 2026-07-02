import { Paper, Box, Grid, useTheme } from "@mui/material";
import { SectionLabel, FieldRow } from "../UserDetailsView";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EventIcon from "@mui/icons-material/Event";
import { formatCurrency } from "@/utils/currency-helpers";

// Assuming we have a type definition, we'll inline it here or in users.ts.
// Since we don't have the generated API client updated yet, we use a custom interface.
interface CustomerDetails {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalSpent: number;
  lastBookingDate?: string;
}

interface CustomerInformationCardProps {
  customerDetails?: CustomerDetails | null;
  t: (key: string) => string;
}

export default function CustomerInformationCard({ customerDetails, t }: CustomerInformationCardProps) {
  const theme = useTheme();

  if (!customerDetails) return null;

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
        <SectionLabel>{t("details.customerInformation") || "Customer Information"}</SectionLabel>

        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FieldRow
                icon={<ShoppingBagIcon sx={{ fontSize: 17 }} />}
                label={t("details.totalBookings") || "Total Bookings"}
                value={customerDetails.totalBookings?.toString() || "0"}
                accentColor={theme.palette.primary.main}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FieldRow
                icon={<CheckCircleIcon sx={{ fontSize: 17 }} />}
                label={t("details.completedBookings") || "Completed Bookings"}
                value={customerDetails.completedBookings?.toString() || "0"}
                accentColor={theme.palette.status.active.main || theme.palette.success.main}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FieldRow
                icon={<CancelIcon sx={{ fontSize: 17 }} />}
                label={t("details.cancelledBookings") || "Cancelled Bookings"}
                value={customerDetails.cancelledBookings?.toString() || "0"}
                accentColor={theme.palette.status.blocked.main || theme.palette.error.main}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FieldRow
                icon={<AttachMoneyIcon sx={{ fontSize: 17 }} />}
                label={t("details.totalSpent") || "Total Spent"}
                value={formatCurrency(customerDetails.totalSpent || 0)}
                accentColor={theme.palette.secondary.main || theme.palette.primary.main}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FieldRow
                icon={<EventIcon sx={{ fontSize: 17 }} />}
                label={t("details.lastBookingDate") || "Last Booking Date"}
                value={customerDetails.lastBookingDate || "—"}
                accentColor={theme.palette.secondary.main || theme.palette.primary.main}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
}
