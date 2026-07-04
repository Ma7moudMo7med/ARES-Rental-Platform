import type { AdminDashboardLabels } from "../../types/admin/dashboard";

const dashboard: AdminDashboardLabels = {
  title: "لوحة تحكم المسؤول | أريس لتأجير السيارات",
  description: "مراقبة الحجوزات، وإدارة الأسطول، والإشراف على أداء النظام من مركز القيادة الإداري لأريس.",
  summary: {
    totalUsers: "إجمالي المستخدمين",
    activeBookings: "الحجوزات النشطة",
    pendingVerifications: "التحققات المعلقة",
    availableVehicles: "السيارات المتاحة",
    pendingInspections: "الفحوصات المعلقة",
  },
  revenue: {
    title: "نظرة عامة على الإيرادات",
    grossRevenue: "إجمالي الإيرادات",
    platformRevenue: "إيرادات المنصة",
    supplierRevenue: "إيرادات الموردين",
    refunds: "المستردات",
    thisMonth: "هذا الشهر",
    lastMonth: "الشهر الماضي",
    thisYear: "هذه السنة",
  },
  recentBookings: {
    title: "الحجوزات الحديثة",
    viewAll: "عرض الكل",
    columns: {
      bookingNumber: "رقم الحجز",
      customer: "العميل",
      vehicle: "السيارة",
      date: "التاريخ",
      status: "الحالة",
    },
    tooltip: {
      viewDetails: "عرض التفاصيل",
    },
  },
  quickActions: {
    title: "إجراءات سريعة",
    createBooking: "إنشاء حجز",
    addUser: "إضافة مستخدم",
    addVehicle: "إضافة سيارة",
    reviewVerifications: "مراجعة التحققات",
    assignInspector: "تعيين فاحص",
  },
  topVehicles: {
    title: "أفضل السيارات حسب الحجوزات",
    viewAll: "عرض الكل",
    bookings: "حجوزات",
  },
  liveActivity: {
    title: "النشاط الأخير",
    tryAgain: "حاول مرة أخرى",
    failedToLoad: "فشل تحميل النشاط الأخير.",
    noActivity: "لا يوجد نشاط أخير متاح.",
    justNow: "الآن",
    minAgo: "منذ {count} دقيقة",
    hrAgo: "منذ {count} ساعة",
    bookingCreatedWithCar: "تم إنشاء حجز لـ {car}",
    bookingCreated: "تم إنشاء الحجز #{id}",
    bookingCreatedByUser: "تم إنشاء الحجز #{id} بواسطة {name}",
    paymentCompletedWithCar: "تم الدفع لـ {car}",
    paymentCompleted: "تم الدفع للحجز #{id}",
    newUserRegistered: "تم تسجيل مستخدم جديد: {name}",
    vehicleAdded: "تم إضافة سيارة {label}",
    verificationSubmitted: "تم تقديم طلب تحقق من {name} ({status})",
    statusPending: "قيد الانتظار",
    statusApproved: "مقبول",
    statusRejected: "مرفوض",
  },
};

export default dashboard;
