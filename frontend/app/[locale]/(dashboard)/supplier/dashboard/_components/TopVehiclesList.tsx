"use client";

import { Box, Card, CardContent, Divider, Stack, Typography, alpha } from "@mui/material";
import { DirectionsCarFilledTwoTone as CarIcon } from "@mui/icons-material";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { toImageUrl } from "@/utils/image-url";
import { type SupplierTopVehicle } from "@/api-clients/supplier-earnings/supplier-earnings";

function formatCount(value: number): string {
  return Number.isFinite(value) ? Math.trunc(value).toLocaleString() : "0";
}

interface TopVehiclesListProps {
  topVehicles: SupplierTopVehicle[] | null;
}

export default function TopVehiclesList({ topVehicles }: TopVehiclesListProps) {
  const t = useTranslations("dashboard.supplierDashboard");

  return (
    <Card
      elevation={0}
      sx={theme => ({
        borderRadius: 2,
        border: "1px solid",
        borderColor: theme.palette.border.main,
        height: "100%",
        boxShadow: theme.palette.shadow.card,
      })}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5, gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {t("topVehicles.heading")}
            </Typography>
          </Box>
        </Box>

        <Stack divider={<Divider flexItem />} spacing={0}>
          {topVehicles?.map(vehicle => (
            <Box
              key={vehicle.vehicleId}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                py: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  overflow: "hidden",
                  flexShrink: 0,
                  bgcolor: th => alpha(th.palette.primary.main, 0.08),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {vehicle.imageUrl ? (
                  <Image
                    src={(toImageUrl(vehicle.imageUrl) as string) || vehicle.imageUrl}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    width={120}
                    height={90}
                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  />
                ) : (
                  <CarIcon fontSize="small" />
                )}
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                  {vehicle.make} {vehicle.model}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {formatCount(vehicle.completedBookingsCount)} {t("topVehicles.completedBookings")}
                </Typography>
              </Box>
            </Box>
          ))}
          {topVehicles?.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
              {t("topVehicles.noCompletedBookings")}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
