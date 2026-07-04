"use client";

import { Link } from "@/shared/i18n/routing";
import Image from "next/image";
import { Box, Button, Container, Divider, Grid, Stack, TextField, Typography, Link as MuiLink } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  const topCities = [
    { name: t("topCities.cairo"), query: "Cairo" },
    { name: t("topCities.alexandria"), query: "Alexandria" },
    { name: t("topCities.giza"), query: "Giza" },
    { name: t("topCities.sharm"), query: "Sharm El Sheikh" },
    { name: t("topCities.hurghada"), query: "Hurghada" },
    { name: t("topCities.luxor"), query: "Luxor" },
    { name: t("topCities.aswan"), query: "Aswan" },
    { name: t("topCities.portsaid"), query: "Port Said" },
  ];

  const fleetTypes = [
    { label: t("fleetTypes.economy"), query: "Economy Cars" },
    { label: t("fleetTypes.compact"), query: "Compact Cars" },
    { label: t("fleetTypes.midSize"), query: "Mid-Size Sedans" },
    { label: t("fleetTypes.suvs"), query: "SUVs" },
    { label: t("fleetTypes.luxury"), query: "Luxury Vehicles" },
    { label: t("fleetTypes.vans"), query: "Vans & Minivans" },
    { label: t("fleetTypes.electric"), query: "Electric Vehicles" },
    { label: t("fleetTypes.convertibles"), query: "Convertibles" },
  ];

  const company = [
    { label: t("company.aboutUs"), href: "/about" },
    { label: t("company.careers"), href: "/careers" },
    { label: t("company.press"), href: "/press" },
    { label: t("company.blog"), href: "/blog" },
    { label: t("company.partnerships"), href: "/partnerships" },
  ];

  const support = [
    { label: t("support.helpCenter"), href: "/help" },
    { label: t("support.contactUs"), href: "/contact" },
    { label: t("support.faqs"), href: "/faq" },
    { label: t("support.bookingGuide"), href: "/guide" },
    { label: t("support.cancellationPolicy"), href: "/cancellation" },
  ];

  const legal = [
    { label: t("legal.termsOfService"), href: "/terms" },
    { label: t("legal.privacyPolicy"), href: "/privacy" },
    { label: t("legal.cookiePolicy"), href: "/cookies" },
    { label: t("legal.accessibility"), href: "/accessibility" },
  ];

  const paymentMethods = ["Visa", "Mastercard", "PayPal", "Apple Pay", "Google Pay"];

  return (
    <Box component="footer" sx={{ bgcolor: "footer.background", color: "footer.text", pt: 8, pb: 4 }}>
      <Container maxWidth="xl">
        {/* Newsletter Section */}
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            borderRadius: 2,
            p: { xs: 4, md: 6 },
            mb: 8,
          }}
        >
          <Grid container spacing={4} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {t("subscribeTitle")}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {t("subscribeSubtitle")}
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  id="newsletter-email-input"
                  fullWidth
                  placeholder={t("emailPlaceholder")}
                  variant="outlined"
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: 1.5,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                    },
                  }}
                />
                <Button
                  variant="contained"
                  color="warning"
                  size="large"
                  sx={{
                    borderRadius: 1.5,
                    px: 4,
                    fontWeight: "bold",
                    textTransform: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("subscribeButton")}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Main Footer Content */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Company Info */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  position: "relative",
                  width: 140,
                  height: 45,
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Image
                  src="/img/favicon/logo_transparent.png"
                  alt="Ares Logo"
                  fill
                  sizes="140px"
                  style={{
                    objectFit: "contain",
                    filter: "brightness(0) invert(1)",
                    mixBlendMode: "screen",
                  }}
                />
              </Box>
            </Box>
            <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.7 }}>
              {t("companyDesc")}
            </Typography>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <PhoneIcon fontSize="small" />
                <Typography variant="body2">+20 123 456 7890</Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <EmailIcon fontSize="small" />
                <Typography variant="body2">support@ares-rentals.com</Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
                <LocationOnIcon fontSize="small" />
                <Typography variant="body2">{t("topCities.cairo")}, Egypt</Typography>
              </Stack>
            </Stack>
          </Grid>

          {/* Top Cities */}
          <Grid size={{ xs: 6, sm: 6, md: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }} color="footer.title" gutterBottom>
              {t("topCitiesTitle")}
            </Typography>
            <Stack spacing={1}>
              {topCities.map(city => (
                <MuiLink
                  key={city.query}
                  href={`/search?city=${city.query}`}
                  component={Link}
                  color="inherit"
                  underline="hover"
                  sx={{ fontSize: "0.875rem" }}
                >
                  {city.name}
                </MuiLink>
              ))}
            </Stack>
          </Grid>

          {/* Fleet Types */}
          <Grid size={{ xs: 6, sm: 6, md: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }} color="footer.title" gutterBottom>
              {t("fleetTypesTitle")}
            </Typography>
            <Stack spacing={1}>
              {fleetTypes.slice(0, 6).map(type => (
                <MuiLink
                  key={type.query}
                  href={`/search?type=${type.query}`}
                  component={Link}
                  color="inherit"
                  underline="hover"
                  sx={{ fontSize: "0.875rem" }}
                >
                  {type.label}
                </MuiLink>
              ))}
            </Stack>
          </Grid>

          {/* Company */}
          <Grid size={{ xs: 6, sm: 4, md: 1.5 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }} color="footer.title" gutterBottom>
              {t("companyTitle")}
            </Typography>
            <Stack spacing={1}>
              {company.map(item => (
                <MuiLink
                  key={item.label}
                  href={item.href}
                  component={Link}
                  color="inherit"
                  underline="hover"
                  sx={{ fontSize: "0.875rem" }}
                >
                  {item.label}
                </MuiLink>
              ))}
            </Stack>
          </Grid>

          {/* Support */}
          <Grid size={{ xs: 6, sm: 4, md: 1.5 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }} color="footer.title" gutterBottom>
              {t("supportTitle")}
            </Typography>
            <Stack spacing={1}>
              {support.map(item => (
                <MuiLink
                  key={item.label}
                  href={item.href}
                  component={Link}
                  color="inherit"
                  underline="hover"
                  sx={{ fontSize: "0.875rem" }}
                >
                  {item.label}
                </MuiLink>
              ))}
            </Stack>
          </Grid>

          {/* Legal */}
          <Grid size={{ xs: 12, sm: 4, md: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }} color="footer.title" gutterBottom>
              {t("legalTitle")}
            </Typography>
            <Stack spacing={1}>
              {legal.map(item => (
                <MuiLink
                  key={item.label}
                  href={item.href}
                  component={Link}
                  color="inherit"
                  underline="hover"
                  sx={{ fontSize: "0.875rem" }}
                >
                  {item.label}
                </MuiLink>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "footer.divider", mb: 4 }} />

        {/* Bottom Footer */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          sx={{ justifyContent: "space-between", alignItems: "center" }}
          spacing={3}
        >
          {/* Copyright */}
          <Typography variant="body2" color="footer.text">
            {t("copyright", { year: new Date().getFullYear() })}
          </Typography>

          {/* Payment Methods */}
          <Stack direction="row" spacing={2} sx={{ alignItems: "center", flexWrap: "wrap" }}>
            <Typography variant="caption" color="footer.text">
              {t("acceptPayments")}
            </Typography>
            {paymentMethods.map(method => (
              <Box
                key={method}
                sx={{
                  px: 2,
                  py: 0.5,
                  bgcolor: "footer.socialBg",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "footer.divider",
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: "bold" }} color="footer.socialText">
                  {method}
                </Typography>
              </Box>
            ))}
          </Stack>

          {/* Social Media */}
          <Stack direction="row" spacing={1}>
            {[
              { icon: <FacebookIcon />, href: "#" },
              { icon: <TwitterIcon />, href: "#" },
              { icon: <InstagramIcon />, href: "#" },
              { icon: <LinkedInIcon />, href: "#" },
            ].map((social, idx) => (
              <Box
                key={idx}
                component="a"
                href={social.href}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: "footer.socialBg",
                  color: "footer.socialText",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {social.icon}
              </Box>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
