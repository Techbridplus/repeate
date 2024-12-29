"use client";

import { UserRole } from "@/lib/auth";
import { FormError } from "@/components/form-error";
import { useCurrentRole } from "@/hooks/use-current-role";
import { string } from "zod";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: typeof UserRole;
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const role = useCurrentRole();
  console.log("RoleGate role : ",role);
  console.log("RoleGate allowedRole ",allowedRole);
  if (role !== allowedRole) {
    return (
      <FormError message="You do not have permission to view this content!" />
    );
  }
  return <>{children}</>;
};
