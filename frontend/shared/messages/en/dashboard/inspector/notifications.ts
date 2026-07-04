import type { InspectorNotificationsLabels } from "../../../types/dashboard/inspector/notifications";

const notifications: InspectorNotificationsLabels = {
  title: "Notifications",
  subtitle: "Stay updated with your inspections and important alerts.",
  filters: {
    all: "All",
    unread: "Unread",
    read: "Read",
  },
  actions: {
    startInspection: "Start Inspection",
    viewInspection: "View Inspection",
    viewReport: "View Report",
    viewDetails: "View Details",
    view: "View",
  },
  unread: "Unread",
  refresh: "Refresh",
  markAllRead: "Mark All As Read",
  signInPrompt: "Please sign in to view your notifications.",
  loadingFeed: "Loading your feed...",
  allCaughtUp: "You're all caught up!",
  noNotificationsDesc: "No notifications available.",
  readStatus: "Read",
  markAsReadTooltip: "Mark as Read",
  deleteTooltip: "Delete",
  deleteSuccess: "Notification deleted successfully.",
  deleteError: "Failed to delete notification. Please try again.",
  loadError: "Failed to load notifications. Please try again later.",
  bookingNumberLabel: "Booking Number",
  vehicleNameLabel: "Vehicle Name",
  inspectionTypeLabel: "Inspection Type",
};

export default notifications;
