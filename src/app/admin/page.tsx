"use client";

import { AdminGate } from "@/components/admin/admin-gate";
import { AdminShell } from "@/components/admin/admin-shell";
import { HomepageBuilder } from "@/components/admin/homepage-builder";
export default function AdminPage() { return <AdminGate>{(user) => <AdminShell user={user}><HomepageBuilder /></AdminShell>}</AdminGate>; }
