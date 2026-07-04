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
  demoPendingActions: {
    vehiclesAwaitingApproval: {
      title: "Vehicles Awaiting Approval",
      description: "You have 2 vehicles waiting for admin review.",
      actionLabel: "View Vehicles",
    },
    bookingNeedsConfirmation: {
      title: "Booking Needs Confirmation",
      description: "Booking #B-9871 requires your approval.",
      actionLabel: "Review Booking",
    },
    completeProfile: {
      title: "Complete Your Profile",
      description: "Add payout details to receive payments.",
      actionLabel: "Go to Profile",
    },
  },
  liveActivity: {
    bookingCreatedByUser: "Booking #{id} created by {name}",
    bookingCreated: "Booking #{id} created",
    paymentCompleted: "Payment completed for Booking #{id}",
    vehicleAdded: "Vehicle added: {label}",
  },
  errors: {
    notSignedIn: "You must be signed in to view dashboard stats.",
    loadFailed: "Could not load your dashboard stats. Please try again shortly.",
  },
};
