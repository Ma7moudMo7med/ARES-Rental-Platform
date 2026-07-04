import type { AssignmentCenterLabels } from "../../../types/dashboard/admin/assignment-center";

const assignmentCenter: AssignmentCenterLabels = {
  title: "مركز تعيين المفتشين",
  description: "تعيين المفتشين للمحجوزات المعلقة بسرعة.",
  refresh: "تحديث",
  pendingPickups: "الاستلامات المعلقة",
  pendingReturns: "عمليات الإرجاع المعلقة",
  availableInspectors: "المفتشون المتاحون",
  totalPending: "إجمالي المعلق",
  searchPlaceholder: "البحث برقم الحجز، العميل، المركبة...",
  inspectionType: "نوع الفحص",
  all: "الكل",
  pickup: "استلام",
  return: "إرجاع",
  bookingNumber: "رقم الحجز",
  customer: "العميل",
  vehicle: "المركبة",
  type: "النوع",
  date: "التاريخ",
  currentInspector: "المفتش الحالي",
  action: "الإجراء",
  noPendingAssignments: "لم يتم العثور على تعيينات معلقة.",
  notAssigned: "غير معين",
  selectInspector: "اختر مفتشاً",
  assign: "تعيين",
  refreshSuccess: "تم تحديث التعيينات بنجاح.",
  refreshError: "فشل تحديث التعيينات.",
  assignSuccess: "تم تعيين المفتش بنجاح.",
  assignError: "فشل تعيين المفتش.",
  unknown: "غير معروف",
};

export default assignmentCenter;
