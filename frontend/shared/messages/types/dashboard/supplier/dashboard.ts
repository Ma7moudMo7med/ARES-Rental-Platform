export interface SupplierDashboardLabels {
  title: string;
  description: string;
  greeting: {
    welcomeBack: string;
    fleetPerformance: string;
  };
  stats: {
    totalVehicles: string;
    pendingVehicles: string;
    activeBookings: string;
    totalEarnings: string;
  };
  charts: {
    earningsOverview: string;
    bookingsByStatus: string;
    earnings: string;
    bookingStatus: {
      pending: string;
      confirmed: string;
      active: string;
      completed: string;
      cancelled: string;
    };
  };
  topVehicles: {
    heading: string;
    noCompletedBookings: string;
    completedBookings: string;
  };
  vehicleStatus: {
    heading: string;
  };
  recentActivity: string;
  noRecentActivity: string;
  demoPendingActions: {
    vehiclesAwaitingApproval: {
      title: string;
      description: string;
      actionLabel: string;
    };
    bookingNeedsConfirmation: {
      title: string;
      description: string;
      actionLabel: string;
    };
    completeProfile: {
      title: string;
      description: string;
      actionLabel: string;
    };
  };
  liveActivity: {
    bookingCreatedByUser: string;
    bookingCreated: string;
    paymentCompleted: string;
    vehicleAdded: string;
  };
  errors: {
    notSignedIn: string;
    loadFailed: string;
  };
}
