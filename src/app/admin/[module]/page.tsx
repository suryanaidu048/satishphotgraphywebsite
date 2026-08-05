"use client";

import { useParams } from "next/navigation";
import { AdminGate } from "@/components/admin/admin-gate";
import { AdminShell } from "@/components/admin/admin-shell";
import { ModuleManager } from "@/components/admin/module-manager";

const modules = ["gallery", "services", "pricing", "testimonials", "bookings", "messages", "analytics", "settings"];
export default function AdminModulePage() {
  const params = useParams<{ module: string }>();
  const module = params?.module ?? "";
  if (!module || !modules.includes(module)) {
    return <main className="grid min-h-screen place-items-center bg-[#10100f] text-white">Module not found</main>;
  }
  return (
    <AdminGate>
      {(user) => (
        <AdminShell user={user}>
          <ModuleManager module={module} user={user} />
        </AdminShell>
      )}
    </AdminGate>
  );
}
