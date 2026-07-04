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
  errors: {
    notSignedIn: "يجب تسجيل الدخول لعرض إحصائيات لوحة التحكم.",
    loadFailed: "تعذر تحميل إحصائيات لوحة التحكم. يرجى المحاولة مرة أخرى قريبًا.",
  },
};
