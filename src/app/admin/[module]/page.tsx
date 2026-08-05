import { AdminModuleClient } from "@/components/admin/admin-module-client";

const modules = ["gallery", "services", "pricing", "testimonials", "bookings", "messages", "analytics", "settings"];

export function generateStaticParams() {
  return modules.map((module) => ({ module }));
}

export default async function AdminModulePage(props: { params: Promise<{ module: string }> | { module: string } }) {
  const resolvedParams = await props.params;
  const module = resolvedParams?.module ?? "";
  return <AdminModuleClient initialModule={module} />;
}
