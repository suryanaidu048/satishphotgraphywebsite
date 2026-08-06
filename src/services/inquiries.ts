import { push, ref, set } from "firebase/database";
import { database } from "@/lib/firebase";

export async function sendEmailNotification(kind: "bookings" | "messages", values: Record<string, string>) {
  const targetEmail = "gajulasuryateja8@gmail.com";
  const subject = kind === "bookings"
    ? `New Booking Inquiry from ${values.name || "Website Guest"}`
    : `New Contact Message from ${values.name || "Website Guest"}`;

  try {
    const formData = new FormData();
    formData.append("access_key", "8b23c91a-7e12-421d-b63d-df7e74d11532");
    formData.append("subject", subject);
    formData.append("from_name", "Satish Photography Website");
    formData.append("to", targetEmail);
    formData.append("email", values.email || "");
    formData.append("name", values.name || "");
    formData.append("message", `
New inquiry received from website:

• Name: ${values.name || "N/A"}
• Email: ${values.email || "N/A"}
• Mobile: ${values.phone || "N/A"}
${values.date ? `• Date: ${values.date}\n` : ""}${values.eventType ? `• Event Type: ${values.eventType}\n` : ""}
• Message:
${values.message || "N/A"}
    `.trim());

    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    }).catch(() => null);
  } catch (err) {
    console.error("Email dispatch notification failed", err);
  }
}

export async function createInquiry(kind: "bookings" | "messages", values: Record<string, string>) {
  if (database) {
    const target = push(ref(database, kind));
    await set(target, { ...values, status: "new", createdAt: Date.now() });
  }

  // Send email to owner
  await sendEmailNotification(kind, values);
}
