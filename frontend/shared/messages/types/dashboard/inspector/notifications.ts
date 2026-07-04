export interface InspectorNotificationsLabels {
  title: string;
  subtitle: string;
  filters: {
    all: string;
    unread: string;
    read: string;
  };
  actions: {
    startInspection: string;
    viewInspection: string;
    viewReport: string;
    viewDetails: string;
    view: string;
  };
  unread: string;
  refresh: string;
  markAllRead: string;
  signInPrompt: string;
  loadingFeed: string;
  allCaughtUp: string;
  noNotificationsDesc: string;
  readStatus: string;
  markAsReadTooltip: string;
  deleteTooltip: string;
  deleteSuccess: string;
  deleteError: string;
  loadError: string;
  bookingNumberLabel: string;
  vehicleNameLabel: string;
  inspectionTypeLabel: string;
}
