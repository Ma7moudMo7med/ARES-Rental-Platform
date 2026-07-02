import type { AdminDashboardLabels } from "../../types/admin/dashboard";

const dashboard: AdminDashboardLabels = {
  title: "Admin Dashboard | ARES Car Rental",
  description: "Monitor bookings, manage fleet, and oversee system performance from the ARES administrative command center.",
  summary: {
    totalUsers: "Total Users",
    activeBookings: "Active Bookings",
    pendingVerifications: "Pending Verifications",
    availableVehicles: "Available Vehicles",
    pendingInspections: "Pending Inspections",
  },
  revenue: {
    title: "Revenue Overview",
    grossRevenue: "Gross Revenue",
    platformRevenue: "Platform Revenue",
    supplierRevenue: "Supplier Revenue",
    refunds: "Refunds",
    thisMonth: "This Month",
    lastMonth: "Last Month",
    thisYear: "This Year",
  },
  recentBookings: {
    title: "Recent Bookings",
    viewAll: "View All",
    columns: {
      bookingNumber: "Booking Number",
      customer: "Customer",
      vehicle: "Vehicle",
      date: "Date",
      status: "Status",
    },
    tooltip: {
      viewDetails: "View Details",
    },
  },
  quickActions: {
    title: "Quick Actions",
    createBooking: "Create Booking",
    addUser: "Add User",
    addVehicle: "Add Vehicle",
    reviewVerifications: "Review Verifications",
    assignInspector: "Assign Inspector",
  },
  topVehicles: {
    title: "Top Vehicles by Bookings",
    viewAll: "View All",
    bookings: "bookings",
  },
  liveActivity: {
    title: "Recent Activity",
    tryAgain: "Try again",
    failedToLoad: "Failed to load recent activity.",
    noActivity: "No recent activity available.",
    justNow: "just now",
    minAgo: "{count} min ago",
    hrAgo: "{count} hr ago",
    bookingCreatedWithCar: "Booking for {car} created",
    bookingCreated: "Booking #{id} created",
    paymentCompletedWithCar: "Payment completed for {car}",
    paymentCompleted: "Payment completed for Booking #{id}",
    newUserRegistered: "New user registered: {name}",
    vehicleAdded: "Vehicle {label} added",
    verificationSubmitted: "Verification submitted by {name} ({status})",
  },
};

export default dashboard;
