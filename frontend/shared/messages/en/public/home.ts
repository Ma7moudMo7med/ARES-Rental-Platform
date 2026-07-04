import type { HomeLabels } from "../../types/public/home";

const home: HomeLabels = {
  hero: {
    defaultTitle: "Find the right car for your next adventure.",
    defaultDescription: "Compare top providers, see honest reviews, and book instantly.",
  },
  searchForm: {
    locationPlaceholder: "Pick-up Location",
    allLocations: "All Locations",
    pickupDatePlaceholder: "Pick-up Date & Time",
    returnDatePlaceholder: "Return Date & Time",
    searchButton: "Search Vehicles",
    presets: {
      tomorrow: "Tomorrow",
      weekend: "Weekend",
      week: "1 Week",
    },
  },
  trustIndicators: {
    bestPrice: {
      title: "Best Price Guarantee",
      desc: "We match any lower price you find",
    },
    freeCancellation: {
      title: "Free Cancellation",
      desc: "Up to 48 hours before pick-up",
    },
    topVehicles: {
      title: "10,000+ Vehicles",
      desc: "From economy to luxury classes",
    },
    support: {
      title: "24/7 Support",
      desc: "We're always here to help you",
    },
  },
  popularDestinations: {
    title: "Explore Top Destinations",
    subtitle: "Find the perfect car for your journey in our most popular locations.",
    explore: "Explore",
    exploreAll: "Explore All Destinations",
    topDestinations: "Top Destinations",
    popularCities: "Popular Cities",
    fromPrice: "From {price}/day",
    vehiclesAvailable: "{count}+ vehicles available",
  },
  vehicleClasses: {
    title: "Vehicle Classes for Every Need",
    subtitle: "From compact city cars to spacious family SUVs, we have the perfect vehicle for your journey.",
    startingAt: "Starting at",
    day: "/day",
    viewVehicles: "View Vehicles",
    classNames: {
      economy: "Economy",
      compact: "Compact",
      intermediate: "Intermediate",
      standard: "Standard",
      fullSize: "Full Size",
      premium: "Premium",
      luxury: "Luxury",
      minivans: "Minivans",
      suvs: "SUVs",
      convertibles: "Convertibles",
      commercial: "Commercial",
      special: "Special",
    },
    descriptions: {
      economy: "Small, fuel-efficient cars for city driving and short trips.",
      compact: "Slightly larger than economy, offering better trunk space for couples or small families.",
      intermediate: "Comfortable sedans for business trips or family getaways.",
      standard: "Spacious sedans with ample legroom and luggage capacity.",
      fullSize: "Large, powerful cars for maximum comfort on long journeys.",
      premium: "High-end vehicles offering superior comfort, technology, and performance.",
      luxury: "Top-of-the-line models from prestige brands for the ultimate driving experience.",
      minivans: "7 to 9 seaters perfect for large families or group travel.",
      suvs: "Versatile vehicles with high seating position, great for all terrains and weather.",
      convertibles: "Open-top cars for enjoying sunny weather and scenic drives.",
      commercial: "Vans and trucks for moving cargo or business needs.",
      special: "Unique vehicles including sports cars, electric models, and specialty imports.",
    },
  },
  whyChooseUs: {
    title: "Why Choose Us",
    subtitle: "We are committed to providing you with the best car rental experience.",
    features: {
      noHiddenFees: {
        title: "No Hidden Charges",
        desc: "Pay exactly what you see. Transparent pricing with no surprises at checkout.",
      },
      verifiedReviews: {
        title: "Verified Reviews",
        desc: "Trust honest feedback from real customers who've rented before you.",
      },
      premiumFleet: {
        title: "Premium Fleet",
        desc: "Access a wide range of well-maintained vehicles for every journey.",
      },
      flexiblePlans: {
        title: "Flexible Plans",
        desc: "Choose rental options that fit your schedule and budget perfectly.",
      },
      support247: {
        title: "24/7 Support",
        desc: "Our customer care team is always here to assist you, anytime.",
      },
      instantBooking: {
        title: "Instant Booking",
        desc: "Book online in seconds and get instant confirmation for your rental.",
      },
    },
  },
  partnerLogos: {
    title: "Trusted by industry leaders",
  },
  destinationMap: {
    title: "Destination Discovery",
    subtitle: "Find our premium fleet in hundreds of locations worldwide.",
    available: "Available",
    viewVehicles: "View Vehicles",
  },
  support: {
    title: "We're here to help",
    subtitle: "Our dedicated support team is available 24/7 to assist you with your booking.",
    chat: {
      title: "Live Chat",
      desc: "Chat with our support team in real-time.",
      btn: "Start Chat",
    },
    call: {
      title: "Phone Support",
      desc: "Call us anytime for urgent assistance.",
      btn: "Call Now",
    },
    email: {
      title: "Email Support",
      desc: "Send us an email and we'll reply within 24 hours.",
      btn: "Send Email",
    },
    features: {
      f1: "24/7 Phone Support",
      f2: "Easy Online Cancellation",
      f3: "Local Area Guides",
      f4: "Dedicated Fleet Managers",
    },
    review: {
      text: '"The easiest rental I\'ve ever booked."',
      author: "— Sarah J., Verified Review",
      rating: "5.0 out of 5",
    },
    contactSupportBtn: "Contact Support",
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Find answers to common questions about our car rental service.",
    defaultItems: {
      q1: "How do I book a rental car?",
      a1: "Simply select your pickup location, dates, and browse available vehicles. Click 'Reserve Now' on your chosen vehicle to complete the booking process.",
      q2: "What documents do I need to pick up the car?",
      a2: "You'll need a valid driver's license, a credit card in your name, and your booking confirmation. International renters may need a passport and international driving permit.",
      q3: "Can I cancel or modify my reservation?",
      a3: "Yes, you can cancel or modify your reservation through your account dashboard. Cancellation policies vary by supplier, so please review the terms during booking.",
      q4: "Is insurance included in the rental price?",
      a4: "Basic insurance is typically included, but coverage levels vary. You can add additional protection during the booking process for extra peace of mind.",
      q5: "What if I return the car late?",
      a5: "Late returns may incur additional charges based on the supplier's policy. We recommend contacting the rental location if you anticipate being late to discuss options.",
    },
    stillHaveQuestions: "Still have questions?",
    contactSupport: "Contact our support team →",
  },
};

export default home;
