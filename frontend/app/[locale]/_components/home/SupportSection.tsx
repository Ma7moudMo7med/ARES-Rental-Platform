"use client";

import { Link } from "@/shared/i18n/routing";
import { Box, Button, Grid, List, ListItem, ListItemIcon, ListItemText, Paper, Typography, alpha } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import type { PublicLandingSupport } from "@/utils/public-data";
import { useTranslations } from "next-intl";

interface SupportSectionProps {
  readonly support?: PublicLandingSupport | null;
}

export default function SupportSection({ support }: Readonly<SupportSectionProps>) {
  const t = useTranslations("publicPages.home.support");
  const supportTitle = support?.title || t("title");
  const supportDescription = support?.description || t("subtitle");
  const supportActionLabel = support?.actionLabel || t("contactSupportBtn");

  return (
    <Paper
      elevation={2}
      sx={{
        bgcolor: "primary.main", // Solid color throughout - no split background
        color: "primary.contrastText",
        borderRadius: 2, // Reduced from 6 (48px) to 3 (24px) for structured look
        overflow: "hidden",
      }}
    >
      <Grid container>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              p: { xs: 4, md: 8 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2, fontSize: { xs: "2rem", md: "3rem" } }}>
              {supportTitle}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                mb: 4,
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              {supportDescription}
            </Typography>
            <List sx={{ mb: 3 }}>
              {[t("features.f1"), t("features.f2"), t("features.f3"), t("features.f4")].map((item, idx) => (
                <ListItem
                  key={idx}
                  disablePadding
                  sx={{
                    mb: 1.5, // Increased from 1 to 1.5 (12px) for better spacing
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckCircleRoundedIcon
                      color="warning"
                      sx={{ fontSize: 28 }} // Slightly larger icons
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item}
                    slotProps={{
                      primary: {
                        sx: {
                          fontWeight: "bold",
                          fontSize: "1.05rem",
                        },
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
            <Box>
              <Link href="/contact" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  color="warning"
                  size="large"
                  sx={{
                    fontWeight: "bold",
                    borderRadius: 1.5, // Reduced from pill to subtle 12px rounding
                    px: 4,
                    py: 1.5,
                    fontSize: "1.05rem",
                    textTransform: "none",
                    boxShadow: 2,
                    "&:hover": {
                      boxShadow: 4,
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  {supportActionLabel}
                </Button>
              </Link>
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              minHeight: { xs: 300, md: "auto" },
              height: { md: "100%" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: { xs: 4, md: 6 },
              position: "relative",
              overflow: "hidden",
              // Subtle gradient overlay instead of hard split
              background: theme =>
                `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(
                  theme.palette.primary.main,
                  0.05
                )} 100%)`,
            }}
          >
            {/* Optional: subtle pattern or texture */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: "url('/img/view-on-map.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.08, // Very subtle background image
                zIndex: 0,
              }}
            />

            <Paper
              elevation={8}
              sx={{
                p: { xs: 3, md: 4 }, // Increased padding from 4 to 3-4 (24-32px)
                borderRadius: 2, // Reduced from 4 (32px) to 2 (16px) - proper card shape
                position: "relative",
                zIndex: 2,
                maxWidth: 480, // Increased from 400 to 480 for better presence
                width: "100%",
                bgcolor: "background.paper",
                // Softer, more modern shadow
                boxShadow: theme => `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                  lineHeight: 1.4,
                }}
              >
                {t("review.text")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {t("review.author")}
              </Typography>

              {/* Optional: Add star rating for credibility */}
              <Box
                sx={{
                  mt: 2,
                  pt: 2,
                  borderTop: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                {[1, 2, 3, 4, 5].map(star => (
                  <Box
                    key={star}
                    component="span"
                    sx={{
                      color: "warning.main",
                      fontSize: "1.2rem",
                    }}
                  >
                    ★
                  </Box>
                ))}
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  {t("review.rating")}
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
