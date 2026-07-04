import type { SupplierDashboardLabels } from "../../../types/dashboard/supplier/dashboard";

export const supplierDashboard: SupplierDashboardLabels = {
  title: "لوحة تحكم الموردين | ARES لتأجير السيارات",
  description: "أدر أسطولك، وتتبع الحجوزات، وراقب أرباحك من بوابة موردي ARES.",
  greeting: {
    welcomeBack: "مرحبًا بعودتك",
    fleetPerformance: "إليك نظرة سريعة على أداء أسطولك.",
  },
  stats: {
    totalVehicles: "إجمالي المركبات",
    pendingVehicles: "المركبات قيد الانتظار",
    activeBookings: "الحجوزات النشطة",
    totalEarnings: "إجمالي الأرباح",
  },
  charts: {
    earningsOverview: "نظرة عامة على الأرباح",
    bookingsByStatus: "الحجوزات حسب الحالة",
    earnings: "الأرباح",
    bookingStatus: {
      pending: "قيد الانتظار",
      confirmed: "مؤكد",
      active: "نشط",
      completed: "مكتمل",
      cancelled: "ملغي",
    },
  },
  topVehicles: {
    heading: "المركبات الأعلى أداءً",
    noCompletedBookings: "لا توجد حجوزات مكتملة بعد.",
    completedBookings: "حجوزات مكتملة",
  },
  vehicleStatus: {
    heading: "حالة المركبات",
  },
  recentActivity: "النشاط الأخير",
  noRecentActivity: "لا يوجد نشاط أخير.",
  demoPendingActions: {
    vehiclesAwaitingApproval: {
      title: "مركبات في انتظار الموافقة",
      description: "لديك مركبتان في انتظار مراجعة المسؤول.",
      actionLabel: "عرض المركبات",
    },
    bookingNeedsConfirmation: {
      title: "حجز بحاجة للتأكيد",
      description: "الحجز #B-9871 يتطلب موافقتك.",
      actionLabel: "مراجعة الحجز",
    },
    completeProfile: {
      title: "أكمل ملفك الشخصي",
      description: "أضف تفاصيل الدفع لتلقي المدفوعات.",
      actionLabel: "الذهاب للملف الشخصي",
    },
  },
  liveActivity: {
    bookingCreatedByUser: "تم إنشاء الحجز #{id} بواسطة {name}",
    bookingCreated: "تم إنشاء الحجز #{id}",
    paymentCompleted: "تم اكتمال الدفع للحجز #{id}",
    vehicleAdded: "تمت إضافة المركبة: {label}",
  },
  errors: {
    notSignedIn: "يجب تسجيل الدخول لعرض إحصائيات لوحة التحكم.",
    loadFailed: "تعذر تحميل إحصائيات لوحة التحكم. يرجى المحاولة مرة أخرى قريبًا.",
  },
};
