import { push, ref, set } from "firebase/database";
import { database } from "@/lib/firebase";

export async function sendEmailNotification(kind: "bookings" | "messages", values: Record<string, string>) {
  const targetEmail = "gajulasuryateja8@gmail.com";
  const subject = kind === "bookings"
    ? `New Booking Inquiry from ${values.name || "Website Guest"}`
    : `New Contact Message from ${values.name || "Website Guest"}`;

  const payload = {
    subject,
    recipient: targetEmail,
    name: values.name || "N/A",
    email: values.email || "N/A",
    phone: values.phone || "N/A",
    date: values.date || "N/A",
    eventType: values.eventType || "N/A",
    message: values.message || "N/A",
  };

  try {
    // 1. Google Apps Script Web App trigger (if configured in env)
    const appsScriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;
    if (appsScriptUrl) {
      await fetch(appsScriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => null);
    }

    // 2. Direct background HTTPS email trigger to gajulasuryateja8@gmail.com
    await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        _subject: subject,
        _template: "table",
        _captcha: "false",
        "Client Name": payload.name,
        "Email Address": payload.email,
        "Mobile Number": payload.phone,
        "Event Date": payload.date,
        "Session Type": payload.eventType,
        "Message Details": payload.message,
      }),
    }).catch(() => null);
  } catch (err) {
    console.error("Background email dispatch error:", err);
  }
}

export async function createInquiry(kind: "bookings" | "messages", values: Record<string, string>) {
  if (database) {
    const target = push(ref(database, kind));
    await set(target, { ...values, status: "new", createdAt: Date.now() });
  }

  // Silently trigger background email dispatch to gajulasuryateja8@gmail.com
  await sendEmailNotification(kind, values);
}
