import { Box, Container, Divider, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";
import HeroSection from "./_components/home/HeroSection";
import SearchForm from "./_components/home/SearchForm";
import TrustIndicators from "./_components/home/TrustIndicators";
import PopularDestinationsServer from "./_components/home/PopularDestinationsServer";
import VehicleClassesSection from "./_components/home/VehicleClassesSection";
import WhyChooseUsSection from "./_components/home/WhyChooseUsSection";
import PartnerLogos from "./_components/home/PartnerLogos";
import DestinationMapWrapper from "./_components/home/DestinationMapWrapper";
import SupportSection from "./_components/home/SupportSection";
import FAQSection from "./_components/home/FAQSection";
import Footer from "@/components/layout/Footer";
import {
  fetchPublicDestinations,
  fetchLandingContent,
  fetchPublicLocations,
  fetchPublicSuppliers,
} from "@/utils/public-data";
import { toApiDate } from "@/utils/dateTime";

export const dynamic = "force-dynamic";

function getDefaultDates() {
  const pickupDate = new Date();
  pickupDate.setDate(pickupDate.getDate() + 1);

  const returnDate = new Date();
  returnDate.setDate(returnDate.getDate() + 4);

  return {
    pickupDate: toApiDate(pickupDate),
    returnDate: toApiDate(returnDate),
  };
}

export default async function Home({ params: { locale } }: { readonly params: { readonly locale: string } }) {
  const t = await getTranslations({ locale, namespace: "publicPages.home" });

  const [locations, landingContent, destinations, suppliers] = await Promise.all([
    fetchPublicLocations(locale),
    fetchLandingContent(locale),
    fetchPublicDestinations(4, locale),
    fetchPublicSuppliers(8, locale),
  ]);

  const defaultDates = getDefaultDates();
  const defaultLocationId = locations[0]?.id ?? "";

  const faqItems = landingContent?.faqItems ?? [
    {
      question: t("faq.defaultItems.q1"),
      answer: t("faq.defaultItems.a1"),
    },
    {
      question: t("faq.defaultItems.q2"),
      answer: t("faq.defaultItems.a2"),
    },
    {
      question: t("faq.defaultItems.q3"),
      answer: t("faq.defaultItems.a3"),
    },
    {
      question: t("faq.defaultItems.q4"),
      answer: t("faq.defaultItems.a4"),
    },
    {
      question: t("faq.defaultItems.q5"),
      answer: t("faq.defaultItems.a5"),
    },
  ];

  const heroTitle = landingContent?.heroTitle ?? t("hero.defaultTitle");
  const heroDescription = landingContent?.heroDescription ?? t("hero.defaultDescription");
  const valueProps = landingContent?.valueProps ?? [];
  const support = landingContent?.support;

  return (
    <Box component="main" sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <HeroSection heroTitle={heroTitle} heroDescription={heroDescription} />

      <SearchForm
        locations={locations}
        defaultLocationId={defaultLocationId}
        defaultPickupDate={defaultDates.pickupDate}
        defaultReturnDate={defaultDates.returnDate}
      />

      {/* Trust indicators immediately under search bar */}
      <TrustIndicators valueProps={valueProps} />

      {/* Popular destinations with visual cards - Server-side rendered */}
      <PopularDestinationsServer destinations={destinations} />

      <Container maxWidth="xl" sx={{ display: "flex", flexDirection: "column", gap: 10, py: 10 }}>
        <VehicleClassesSection defaultLocationId={defaultLocationId} />

        <WhyChooseUsSection />

        {/* Partner/Brand logos for credibility */}
        <Box sx={{ mx: { xs: -2, md: -3 } }}>
          <PartnerLogos suppliers={suppliers} />
        </Box>

        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}>
            {t("destinationMap.title")}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", mb: 4 }}>
            {t("destinationMap.subtitle")}
          </Typography>
          <DestinationMapWrapper locations={locations} />
        </Box>

        <SupportSection support={support} />

        <Divider />

        <FAQSection faqItems={faqItems} />
      </Container>

      {/* Comprehensive footer */}
      <Footer />
    </Box>
  );
}
