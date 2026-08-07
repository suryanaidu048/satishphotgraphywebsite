import { push, ref, set } from "firebase/database";
import { database } from "@/lib/firebase";

export async function sendEmailNotification(kind: "bookings" | "messages", values: Record<string, string>) {
  const targetEmail = "gajulasuryateja8@gmail.com";
  const subject = kind === "bookings"
    ? `New Booking Inquiry from ${values.name || "Website Guest"}`
    : `New Contact Message from ${values.name || "Website Guest"}`;

  const payload: Record<string, string> = {
    subject,
    recipient: targetEmail,
    name: values.name || "N/A",
    email: values.email || "N/A",
    phone: values.phone || "N/A",
    date: values.date || "N/A",
    eventType: values.eventType || "N/A",
    message: values.message || "N/A",
  };

  const appsScriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbwaoHQ_KPWhrKOl6JvpxkDDmm3Zp7MHPvyKSFOM_yf57JzdxzmcHcclSvjZkHmZbkOh7Q/exec";

  if (typeof window === "undefined") return;

  try {
    const queryString = new URLSearchParams(payload).toString();

    // 1. Primary: Hidden iframe form submission
    let iframe = document.getElementById("gscript_hidden_iframe") as HTMLIFrameElement;
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "gscript_hidden_iframe";
      iframe.name = "gscript_hidden_iframe";
      iframe.style.display = "none";
      document.body.appendChild(iframe);
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = `${appsScriptUrl}?${queryString}`;
    form.target = "gscript_hidden_iframe";
    form.style.display = "none";

    Object.entries(payload).forEach(([key, val]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = val;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();

    // 2. Secondary: Background fetch fallback
    await fetch(`${appsScriptUrl}?${queryString}`, {
      method: "GET",
      mode: "no-cors",
    }).catch(() => null);

    setTimeout(() => {
      form.remove();
    }, 1500);
  } catch (err) {
    console.error("Google Apps Script email dispatch error:", err);
  }
}

export async function createInquiry(kind: "bookings" | "messages", values: Record<string, string>) {
  if (database) {
    const target = push(ref(database, kind));
    await set(target, { ...values, status: "new", createdAt: Date.now() });
  }

  // Trigger background email dispatch to Google Apps Script
  await sendEmailNotification(kind, values);
}
