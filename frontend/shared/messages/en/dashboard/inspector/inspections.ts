import type { InspectorInspectionsLabels } from "../../../types/dashboard/inspector/inspections";

const inspections: InspectorInspectionsLabels = {
  title: "Inspector Dashboard",
  description: "Overview of your assignments and today's metrics.",
  recentActivityTitle: "Recent Activity",
  upcomingTitle: "Upcoming Inspections",
  checkOuts: "Check-Outs",
  checkOutsSubtitle: "Deliveries today",
  checkIns: "Check-Ins",
  checkInsSubtitle: "Returns today",
  overdue: "Overdue Tasks",
  overdueSubtitle: "Past due",
  completedToday: "Completed Today",
  completedTodaySubtitle: "Done today",
  sectionTitle: "Today's Tasks",
  sectionSubtitle: "Tap a card to open the inspection form · Use the action buttons to call or navigate.",
  filters: {
    all: "All",
    checkOuts: "Check-Outs 🟢",
    checkIns: "Check-Ins 🔴",
  },
  searchPlaceholder: "Search by plate number…",
  searchAriaLabel: "Search by plate number",
  emptyState: {
    noMatchingTasks: "No matching tasks",
    allCaughtUp: "All caught up!",
    adjustFilter: "Try adjusting the filter or search term.",
    noPendingTasks: "You have no pending tasks for today.",
    noUpcoming: "No upcoming inspections scheduled.",
    noRecentActivity: "No recent activity.",
  },
  card: {
    checkOutBadge: "Check-Out 🟢",
    checkInBadge: "Check-In 🔴",
    callTooltip: "Call {customerName}",
    callAriaLabel: "Call {customerName}",
    mapsTooltip: "Open in Google Maps",
    mapsAriaLabel: "Open location in Google Maps",
    startInspection: "Start Inspection",
    view: "View",
  },
  status: {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
  },
  table: {
    time: "Time",
    vehicle: "Vehicle",
    customer: "Customer",
    inspectionType: "Inspection Type",
    status: "Status",
    quickActions: "Quick Actions",
    action: "Action",
  },
};

export default inspections;
