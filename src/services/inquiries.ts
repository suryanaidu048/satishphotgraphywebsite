import { push, ref, set } from "firebase/database";
import { database } from "@/lib/firebase";

export async function sendEmailNotification(kind: "bookings" | "messages", values: Record<string, string>) {
  const targetEmail = "gajulasuryateja8@gmail.com";
  const subject = kind === "bookings"
    ? `New Booking Inquiry from ${values.name || "Website Guest"}`
    : `New Contact Message from ${values.name || "Website Guest"}`;

  const payload = {
    _subject: subject,
    _template: "table",
    _captcha: "false",
    "Client Name": values.name || "N/A",
    "Email Address": values.email || "N/A",
    "Mobile Number": values.phone || "N/A",
    "Event Date": values.date || "N/A",
    "Session Type": values.eventType || "N/A",
    "Message Details": values.message || "N/A",
  };

  try {
    // Primary dispatch: FormSubmit AJAX direct email API
    await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    }).catch(() => null);

    // Backup dispatch: Web3Forms API
    const formData = new FormData();
    formData.append("access_key", "09633e4f-6f29-45e7-9bd0-f408ce8a3064");
    formData.append("subject", subject);
    formData.append("email", values.email || "");
    formData.append("name", values.name || "");
    formData.append("message", `
Name: ${values.name || "N/A"}
Email: ${values.email || "N/A"}
Mobile: ${values.phone || "N/A"}
${values.date ? `Event Date: ${values.date}\n` : ""}${values.eventType ? `Session Type: ${values.eventType}\n` : ""}
Message: ${values.message || "N/A"}
    `.trim());

    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    }).catch(() => null);
  } catch (err) {
    console.error("Email notification dispatch error:", err);
  }
}

export async function createInquiry(kind: "bookings" | "messages", values: Record<string, string>) {
  if (database) {
    const target = push(ref(database, kind));
    await set(target, { ...values, status: "new", createdAt: Date.now() });
  }

  // Send email notification to gajulasuryateja8@gmail.com
  await sendEmailNotification(kind, values);
}
