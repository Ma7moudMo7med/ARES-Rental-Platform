import type { InspectorNotificationsLabels } from "../../../types/dashboard/inspector/notifications";

const notifications: InspectorNotificationsLabels = {
  title: "الإشعارات",
  subtitle: "ابق على اطلاع بفحوصاتك والتنبيهات الهامة.",
  filters: {
    all: "الكل",
    unread: "غير مقروءة",
    read: "مقروءة",
  },
  actions: {
    startInspection: "بدء الفحص",
    viewInspection: "عرض الفحص",
    viewReport: "عرض التقرير",
    viewDetails: "عرض التفاصيل",
    view: "عرض",
  },
  unread: "غير مقروء",
  refresh: "تحديث",
  markAllRead: "تحديد الكل كمقروء",
  signInPrompt: "يرجى تسجيل الدخول لعرض الإشعارات الخاصة بك.",
  loadingFeed: "جاري تحميل إشعاراتك...",
  allCaughtUp: "أنت على اطلاع دائم!",
  noNotificationsDesc: "لا توجد إشعارات متاحة.",
  readStatus: "مقروء",
  markAsReadTooltip: "تحديد كمقروء",
  deleteTooltip: "حذف",
  deleteSuccess: "تم حذف الإشعار بنجاح.",
  deleteError: "فشل حذف الإشعار. يرجى المحاولة مرة أخرى.",
  loadError: "فشل تحميل الإشعارات. يرجى المحاولة مرة أخرى لاحقًا.",
  bookingNumberLabel: "رقم الحجز",
  vehicleNameLabel: "اسم المركبة",
  inspectionTypeLabel: "نوع الفحص",
};

export default notifications;
