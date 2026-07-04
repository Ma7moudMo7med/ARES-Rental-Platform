export type CategoryDetailsLabels = {
  readonly backToCategories: string;
  readonly statusActive: string;
  readonly statusInactive: string;
  readonly title: string;
  readonly editTitle: string;
  readonly viewSubtitle: string;
  readonly editSubtitle: string;
  readonly infoCardTitle: string;
  readonly editBtn: string;
  readonly saveChangesBtn: string;
  readonly fieldName: string;
  readonly fieldStatus: string;
  readonly fieldStatusActive: string;
  readonly fieldStatusInactive: string;
  readonly fieldCommission: string;
  readonly fieldDescription: string;
  readonly uploadImageBtn: string;
  readonly stats: {
    readonly totalVehicles: string;
    readonly totalBookings: string;
    readonly revenue: string;
  };
  readonly vehiclesTable: {
    readonly title: string;
    readonly headers: {
      readonly image: string;
      readonly makeModel: string;
      readonly licensePlate: string;
      readonly dailyPrice: string;
      readonly status: string;
      readonly availability: string;
      readonly actions: string;
    };
    readonly viewButton: string;
    readonly emptyTitle: string;
    readonly empty: string;
    readonly showingCount: string;
    readonly viewAll: string;
  };
  readonly promotions: {
    readonly title: string;
    readonly activeScheduled: string;
    readonly duration: string;
    readonly addBtn: string;
    readonly percentOff: string;
    readonly deleteConfirm: string;
    readonly empty: string;
    readonly emptyDesc: string;
    readonly editBtn: string;
    readonly deleteBtn: string;
    readonly alerts: {
      readonly deleteSuccess: string;
      readonly deleteError: string;
      readonly saveSuccess: string;
      readonly saveError: string;
      readonly loadError: string;
      readonly requiredFields: string;
      readonly dateOrderError: string;
    };
    readonly form: {
      readonly addTitle: string;
      readonly editTitle: string;
      readonly name: string;
      readonly discount: string;
      readonly startDate: string;
      readonly endDate: string;
      readonly status: string;
      readonly namePlaceholder: string;
      readonly statusOptions: {
        readonly active: string;
        readonly inactive: string;
        readonly expired: string;
      };
    };
  };
  readonly errors: {
    readonly notFound: string;
    readonly loadError: string;
    readonly nameRequired: string;
    readonly updateFailed: string;
    readonly uploadImageFailed: string;
  };
  readonly categoryValues: {
    readonly names: {
      readonly suv: string;
      readonly sedan: string;
      readonly luxury: string;
      readonly electric: string;
      readonly sports: string;
      readonly business: string;
    };
    readonly descriptions: {
      readonly suv: string;
      readonly sedan: string;
      readonly luxury: string;
      readonly electric: string;
      readonly sports: string;
      readonly business: string;
    };
  };
};
