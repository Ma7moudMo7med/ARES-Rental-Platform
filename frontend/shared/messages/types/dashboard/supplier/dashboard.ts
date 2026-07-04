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
  errors: {
    notSignedIn: string;
    loadFailed: string;
  };
}
