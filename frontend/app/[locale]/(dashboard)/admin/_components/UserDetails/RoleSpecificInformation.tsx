import { DriverDetails, SupplierDetails } from "@/api-clients/users/users";
import DriverInformationCard from "./DriverInformationCard";
import SupplierInformationCard from "./SupplierInformationCard";
import CustomerInformationCard from "./CustomerInformationCard";
import InspectorInformationCard from "./InspectorInformationCard";
import { UserType } from "../UserDetailsView";

interface RoleSpecificInformationProps {
  userType: UserType;
  roles?: readonly string[];
  driverDetails?: DriverDetails | null;
  supplierDetails?: SupplierDetails | null;
  customerDetails?: any; // The types will be defined in UserDetailsView
  inspectorDetails?: any;
  t: (key: string) => string;
}

export default function RoleSpecificInformation({
  userType,
  roles,
  driverDetails,
  supplierDetails,
  customerDetails,
  inspectorDetails,
  t,
}: RoleSpecificInformationProps) {
  const isDriver = userType === "driver" || roles?.some(r => r.toLowerCase() === "driver");
  const isSupplier = userType === "supplier" || roles?.some(r => r.toLowerCase() === "supplier");
  const isCustomer = userType === "user" || roles?.some(r => r.toLowerCase() === "customer");
  const isInspector = userType === "inspector" || roles?.some(r => r.toLowerCase() === "inspector");

  if (isDriver) {
    return <DriverInformationCard driverDetails={driverDetails} t={t} />;
  }

  if (isSupplier) {
    return <SupplierInformationCard supplierDetails={supplierDetails} t={t} />;
  }

  if (isCustomer) {
    return <CustomerInformationCard customerDetails={customerDetails} t={t} />;
  }

  if (isInspector) {
    return <InspectorInformationCard inspectorDetails={inspectorDetails} t={t} />;
  }

  return null;
}
