export interface HomeFaqItem {
  readonly question: string;
  readonly answer: string;
}

export interface HomeLabels {
  readonly hero: {
    readonly defaultTitle: string;
    readonly defaultDescription: string;
  };
  readonly searchForm: {
    readonly locationPlaceholder: string;
    readonly allLocations: string;
    readonly pickupDatePlaceholder: string;
    readonly returnDatePlaceholder: string;
    readonly searchButton: string;
    readonly presets: {
      readonly tomorrow: string;
      readonly weekend: string;
      readonly week: string;
    };
  };
  readonly trustIndicators: {
    readonly bestPrice: {
      readonly title: string;
      readonly desc: string;
    };
    readonly freeCancellation: {
      readonly title: string;
      readonly desc: string;
    };
    readonly topVehicles: {
      readonly title: string;
      readonly desc: string;
    };
    readonly support: {
      readonly title: string;
      readonly desc: string;
    };
  };
  readonly popularDestinations: {
    readonly title: string;
    readonly subtitle: string;
    readonly explore: string;
    readonly exploreAll: string;
    readonly topDestinations: string;
    readonly popularCities: string;
    readonly fromPrice: string;
    readonly vehiclesAvailable: string;
  };
  readonly vehicleClasses: {
    readonly title: string;
    readonly subtitle: string;
    readonly startingAt: string;
    readonly day: string;
    readonly viewVehicles: string;
    readonly classNames: {
      readonly economy: string;
      readonly compact: string;
      readonly intermediate: string;
      readonly standard: string;
      readonly fullSize: string;
      readonly premium: string;
      readonly luxury: string;
      readonly minivans: string;
      readonly suvs: string;
      readonly convertibles: string;
      readonly commercial: string;
      readonly special: string;
    };
    readonly descriptions: {
      readonly economy: string;
      readonly compact: string;
      readonly intermediate: string;
      readonly standard: string;
      readonly fullSize: string;
      readonly premium: string;
      readonly luxury: string;
      readonly minivans: string;
      readonly suvs: string;
      readonly convertibles: string;
      readonly commercial: string;
      readonly special: string;
    };
  };
  readonly whyChooseUs: {
    readonly title: string;
    readonly subtitle: string;
    readonly features: {
      readonly noHiddenFees: {
        readonly title: string;
        readonly desc: string;
      };
      readonly verifiedReviews: {
        readonly title: string;
        readonly desc: string;
      };
      readonly premiumFleet: {
        readonly title: string;
        readonly desc: string;
      };
      readonly flexiblePlans: {
        readonly title: string;
        readonly desc: string;
      };
      readonly support247: {
        readonly title: string;
        readonly desc: string;
      };
      readonly instantBooking: {
        readonly title: string;
        readonly desc: string;
      };
    };
  };
  readonly partnerLogos: {
    readonly title: string;
  };
  readonly destinationMap: {
    readonly title: string;
    readonly subtitle: string;
    readonly available: string;
    readonly viewVehicles: string;
  };
  readonly support: {
    readonly title: string;
    readonly subtitle: string;
    readonly chat: {
      readonly title: string;
      readonly desc: string;
      readonly btn: string;
    };
    readonly call: {
      readonly title: string;
      readonly desc: string;
      readonly btn: string;
    };
    readonly email: {
      readonly title: string;
      readonly desc: string;
      readonly btn: string;
    };
    readonly features: {
      readonly f1: string;
      readonly f2: string;
      readonly f3: string;
      readonly f4: string;
    };
    readonly review: {
      readonly text: string;
      readonly author: string;
      readonly rating: string;
    };
    readonly contactSupportBtn: string;
  };
  readonly faq: {
    readonly title: string;
    readonly subtitle: string;
    readonly defaultItems: {
      readonly q1: string;
      readonly a1: string;
      readonly q2: string;
      readonly a2: string;
      readonly q3: string;
      readonly a3: string;
      readonly q4: string;
      readonly a4: string;
      readonly q5: string;
      readonly a5: string;
    };
    readonly stillHaveQuestions: string;
    readonly contactSupport: string;
  };
}
