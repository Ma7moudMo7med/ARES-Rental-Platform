import type { SupplierDashboardLabels } from "../../../types/dashboard/supplier/dashboard";

export const supplierDashboard: SupplierDashboardLabels = {
  title: "Supplier Dashboard | ARES Car Rental",
  description: "Manage your fleet, track bookings, and monitor earnings from the ARES supplier portal.",
  greeting: {
    welcomeBack: "Welcome back",
    fleetPerformance: "Here's a snapshot of your fleet's performance.",
  },
  stats: {
    totalVehicles: "Total Vehicles",
    pendingVehicles: "Pending Vehicles",
    activeBookings: "Active Bookings",
    totalEarnings: "Total Earnings",
  },
  charts: {
    earningsOverview: "Earnings Overview",
    bookingsByStatus: "Bookings by Status",
    earnings: "Earnings",
    bookingStatus: {
      pending: "Pending",
      confirmed: "Confirmed",
      active: "Active",
      completed: "Completed",
      cancelled: "Cancelled",
    },
  },
  topVehicles: {
    heading: "Top Performing Vehicles",
    noCompletedBookings: "No completed bookings yet.",
    completedBookings: "completed bookings",
  },
  vehicleStatus: {
    heading: "Vehicle Status",
  },
  recentActivity: "Recent Activity",
  noRecentActivity: "No recent activity.",
  errors: {
    notSignedIn: "You must be signed in to view dashboard stats.",
    loadFailed: "Could not load your dashboard stats. Please try again shortly.",
  },
};
