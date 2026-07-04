export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type?: string | null;
}

export function translateNotification(
  notification: NotificationItem,
  locale: string
): { title: string; message: string } {
  if (locale !== "ar") {
    return { title: notification.title, message: notification.message };
  }

  const type = notification.type || "";
  const tag = type.split(":")[0] || "";

  // 1. Match by tag/type
  switch (tag) {
    case "DriverRequestNew":
      if (notification.title?.toLowerCase().includes("available")) {
        return {
          title: "سائق متاح",
          message: "لقد قبل سائق طلبك! يمكنك الآن مراجعة ملفه الشخصي واختياره لحجزك.",
        };
      }
      return {
        title: "طلب سائق جديد",
        message: "يبحث عميل عن سائق في منطقة عملك. افتح الطلب لإبداء اهتمامك.",
      };

    case "DriverApproved":
      return {
        title: "تمت الموافقة على الملف الشخصي",
        message: "تم التحقق من ملف السائق الخاص بك بنجاح. قم بتعيين حالتك كـ 'متاح' لبدء استقبال الطلبات.",
      };

    case "DriverRejected":
      return {
        title: "تم رفض الملف الشخصي",
        message: notification.message?.includes(":")
          ? `تم رفض ملف السائق الخاص بك: ${notification.message.split(":")[1]}. يرجى التصحيح وإعادة الإرسال.`
          : "تم رفض ملف السائق الخاص بك. يرجى المراجعة وإعادة الإرسال.",
      };

    case "DriverAssigned":
      return {
        title: "تم اختيارك للحجز",
        message: "لقد اختارك العميل لرحلة. تحقق من تفاصيل مهامك الحالية.",
      };

    case "DriverRemoved":
      return {
        title: "تمت إزالة التعيين",
        message: "قام العميل بتغيير اختيار السائق. لم تعد معيناً في هذا الحجز.",
      };

    case "DriverCancelled":
      return {
        title: "إلغاء السائق",
        message: "قام السائق المعين بإلغاء الحجز. لقد أعدنا فتح البحث حتى يمكن اختيار سائق آخر.",
      };

    case "NoDriverAvailable":
      return {
        title: "لا يوجد سائق متاح",
        message: "لم يقبل أي سائق طلبك في الوقت المحدد. يمكنك إعادة محاولة البحث عن سائق من تفاصيل الحجز الخاص بك.",
      };

    case "DriverSelected":
      return {
        title: "تم إغلاق الطلب",
        message: "اختار العميل سائقاً آخر لهذا الطلب. شكراً لاهتمامك.",
      };

    case "DriverEarningReceived":
      return {
        title: "تم استلام أرباح",
        message: "لقد ربحت أرباحاً جديدة من رحلة. تحقق من أرباحك الحالية.",
      };

    case "DriverPayoutCompleted":
      return {
        title: "اكتمل الدفع بنجاح",
        message: "تمت معالجة طلب الدفع الخاص بك بنجاح وتحويل المبلغ.",
      };

    case "DriverPayoutRejected":
      return {
        title: "تم رفض طلب الدفع",
        message: "تم رفض طلب الدفع الخاص بك. يرجى مراجعة التفاصيل.",
      };

    case "BookingPending":
      return {
        title: "تم استلام الحجز",
        message: "تم إنشاء حجزك بنجاح وهو قيد التأكيد الآن من قبل المورد.",
      };

    case "BookingApproved":
      return {
        title: "تم تأكيد الحجز",
        message: "تمت الموافقة على حجزك وتأكيده بنجاح من المورد.",
      };

    case "BookingRejected":
      return {
        title: "تم رفض الحجز",
        message: "تم رفض طلب الحجز الخاص بك من قبل المورد.",
      };

    case "BookingCompleted":
      return {
        title: "اكتمل الحجز بنجاح",
        message: "اكتمل حجزك بنجاح. شكراً لتعاملك معنا.",
      };

    case "BookingPendingPayment":
      return {
        title: "مطلوب دفع قيمة الحجز",
        message: "يرجى إتمام عملية الدفع لتأكيد الحجز الخاص بك.",
      };

    case "IdentityVerified":
      return {
        title: "تم التحقق من الهوية",
        message: "تم التحقق من وثائق الهوية الخاصة بك بنجاح.",
      };

    case "IdentityRejected":
      return {
        title: "فشل التحقق من الهوية",
        message: "فشل التحقق من وثائق الهوية الخاصة بك. يرجى المحاولة مرة أخرى.",
      };

    case "LicenseVerified":
      return {
        title: "تم التحقق من رخصة القيادة",
        message: "تم التحقق من رخصة القيادة الخاصة بك بنجاح.",
      };

    case "LicenseRejected":
      return {
        title: "فشل التحقق من رخصة القيادة",
        message: "فشل التحقق من رخصة القيادة الخاصة بك. يرجى المحاولة مرة أخرى.",
      };

    case "InspectionApproved":
      return {
        title: "تم قبول فحص المركبة",
        message: "تمت الموافقة على فحص مركبتك بنجاح.",
      };

    case "InspectionRejected":
      return {
        title: "تم رفض فحص المركبة",
        message: "تم رفض فحص مركبتك. يرجى مراجعة الملاحظات.",
      };

    case "InspectionAssigned":
      return {
        title: "تم تعيين فحص جديد",
        message: "تم تعيين فحص مركبة جديد لك. يرجى مراجعة المهام.",
      };

    case "SupplierBookingReceived":
      return {
        title: "تم استلام حجز جديد",
        message: "لقد تلقيت حجزاً جديداً لمركبتك.",
      };
  }

  // 2. Fallback to generic message mappings if type is empty or doesn't match
  const titleLower = notification.title?.toLowerCase() || "";
  const msgLower = notification.message?.toLowerCase() || "";

  if (titleLower.includes("new booking received") || titleLower.includes("booking received")) {
    return {
      title: "تم استلام حجز جديد",
      message: msgLower.includes("pending confirmation")
        ? "تم إنشاء حجزك بنجاح وهو قيد التأكيد الآن."
        : "لقد تلقيت حجزاً جديداً لمركبتك.",
    };
  }
  if (titleLower.includes("booking approved") || titleLower.includes("booking confirmed")) {
    return {
      title: "تم تأكيد الحجز",
      message: "تمت الموافقة على حجزك وتأكيده بنجاح.",
    };
  }
  if (titleLower.includes("booking rejected")) {
    return {
      title: "تم رفض الحجز",
      message: "تم رفض طلب الحجز الخاص بك.",
    };
  }
  if (titleLower.includes("booking completed")) {
    return {
      title: "اكتمل الحجز بنجاح",
      message: "اكتمل حجزك بنجاح. شكراً لك.",
    };
  }
  if (titleLower.includes("new inspection assigned")) {
    return {
      title: "تم تعيين فحص جديد",
      message: "تم تعيين فحص مركبة جديد لك. يرجى مراجعة المهام.",
    };
  }

  // Final fallback to original values if no rules match
  return { title: notification.title, message: notification.message };
}
