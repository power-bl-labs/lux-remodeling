import { requireAuth } from "@/lib/auth";
import { AdminDemoShell } from "@/components/admin/admin-demo-shell";

export const metadata = {
  title: "Admin Demo | Lux Remodeling",
};

export default async function AdminDemoPage() {
  const session = await requireAuth();

  return (
    <AdminDemoShell
      userEmail={session.user.email ?? "manager@luxremodeling.com"}
      userRole={session.user.role.toLowerCase()}
    />
  );
}
