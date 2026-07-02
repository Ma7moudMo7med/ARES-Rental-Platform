export type AdminDashboardLabels = {
  readonly title: string;
  readonly description: string;
  readonly summary: {
    readonly totalUsers: string;
    readonly activeBookings: string;
    readonly pendingVerifications: string;
    readonly availableVehicles: string;
    readonly pendingInspections: string;
  };
  readonly revenue: {
    readonly title: string;
    readonly grossRevenue: string;
    readonly platformRevenue: string;
    readonly supplierRevenue: string;
    readonly refunds: string;
    readonly thisMonth: string;
    readonly lastMonth: string;
    readonly thisYear: string;
  };
  readonly recentBookings: {
    readonly title: string;
    readonly viewAll: string;
    readonly columns: {
      readonly bookingNumber: string;
      readonly customer: string;
      readonly vehicle: string;
      readonly date: string;
      readonly status: string;
    };
    readonly tooltip: {
      readonly viewDetails: string;
    };
  };
  readonly quickActions: {
    readonly title: string;
    readonly createBooking: string;
    readonly addUser: string;
    readonly addVehicle: string;
    readonly reviewVerifications: string;
    readonly assignInspector: string;
  };
  readonly topVehicles: {
    readonly title: string;
    readonly viewAll: string;
    readonly bookings: string;
  };
  readonly liveActivity: {
    readonly title: string;
    readonly tryAgain: string;
    readonly failedToLoad: string;
    readonly noActivity: string;
    readonly justNow: string;
    readonly minAgo: string;
    readonly hrAgo: string;
    readonly bookingCreatedWithCar: string;
    readonly bookingCreated: string;
    readonly paymentCompletedWithCar: string;
    readonly paymentCompleted: string;
    readonly newUserRegistered: string;
    readonly vehicleAdded: string;
    readonly verificationSubmitted: string;
  };
};
