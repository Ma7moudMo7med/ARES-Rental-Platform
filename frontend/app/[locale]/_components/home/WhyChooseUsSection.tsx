"use client";

import { Avatar, Box, Grid, Stack, Typography } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import { useTranslations } from "next-intl";

export default function WhyChooseUsSection() {
  const t = useTranslations("publicPages.home.whyChooseUs");

  // Consolidated features - removed redundancy, kept the strongest selling points
  const features = [
    {
      title: t("features.noHiddenFees.title"),
      icon: <CheckCircleRoundedIcon fontSize="large" />,
      desc: t("features.noHiddenFees.desc"),
    },
    {
      title: t("features.verifiedReviews.title"),
      icon: <StarRoundedIcon fontSize="large" />,
      desc: t("features.verifiedReviews.desc"),
    },
    {
      title: t("features.premiumFleet.title"),
      icon: <DirectionsCarRoundedIcon fontSize="large" />,
      desc: t("features.premiumFleet.desc"),
    },
    {
      title: t("features.flexiblePlans.title"),
      icon: <SettingsSuggestRoundedIcon fontSize="large" />,
      desc: t("features.flexiblePlans.desc"),
    },
    {
      title: t("features.support247.title"),
      icon: <SupportAgentRoundedIcon fontSize="large" />,
      desc: t("features.support247.desc"),
    },
    {
      title: t("features.instantBooking.title"),
      icon: <PublicRoundedIcon fontSize="large" />,
      desc: t("features.instantBooking.desc"),
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        py: { xs: 6, md: 10 },
        px: { xs: 3, md: 6 },
        mx: { xs: -2, md: -3 },
        borderRadius: 2, // Reduced from 6 (48px) to 3 (24px) for structured look
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Typography
          variant="h3"
          sx={{ fontWeight: "bold", textAlign: "center", mb: 2, fontSize: { xs: "2rem", md: "3rem" } }}
        >
          {t("title")}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: "center", mb: 8, maxWidth: 600, mx: "auto" }}
        >
          {t("subtitle")}
        </Typography>

        {/* 3x2 Grid for better readability and breathing room */}
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {features.map((feature, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Stack
                spacing={2}
                sx={{
                  alignItems: "center",
                  textAlign: "center",
                  height: "100%",
                  p: 3,
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
              >
                {/* Consistent icon styling - no pill borders */}
                <Avatar
                  sx={{
                    width: 72,
                    height: 72,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    boxShadow: 2,
                  }}
                >
                  {feature.icon}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: "bold", minHeight: 32 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {feature.desc}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
