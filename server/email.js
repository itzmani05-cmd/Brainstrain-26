import { Resend } from "resend";

const EVENT_DATE = "19th September 2026";
const EVENT_VENUE = process.env.EVENT_VENUE || "TBA";
const EVENT_REPORTING_TIME = process.env.EVENT_REPORTING_TIME || "TBA";

let resend;

async function send({ to, subject, html }) {
  try {
    resend ??= new Resend(process.env.RESEND_API_KEY);
    const fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev";
    await resend.emails.send({
      from: `Brainstrain '26 <${fromEmail}>`,
      to,
      subject,
      html,
      replyTo: process.env.FROM_EMAIL,
    });
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err);
  }
}

export function sendRegistrationReceivedEmail(reg) {
  return send({
    to: reg.email,
    subject: "Brainstrain '26 — Registration received",
    html: `
      <p>Hi ${reg.name},</p>
      <p>We've received your registration for <strong>Brainstrain '26</strong>. Your payment is pending verification.</p>
      <p><strong>Transaction ID:</strong> ${reg.transactionId}</p>
      <p>You'll get another email once your payment is verified.</p>
      <p>See you there!<br/>Literary and Debating Society, GCT</p>
    `,
  });
}

export function sendApprovalEmail(reg) {
  return send({
    to: reg.email,
    subject: "BrainStrain '26 — Registration Confirmed",
    html: `
      <p>Dear Participant,</p>
      <p>Thank you for registering for BrainStrain '26! 🎉</p>
      <p>We're happy to confirm that your payment has been successfully verified, and your registration is now complete.</p>
      <p>🧠 Your BrainStrain '26 ID: <strong>${reg.participantId}</strong></p>
      <p>We're super excited to have you join us and can't wait to see you at BrainStrain '26! Get ready for an exciting experience filled with challenges, creativity, and a whole lot of brainpower. 🚀</p>
      <p>Further details and updates will be shared with you soon.</p>
      <p>Once again, thank you for being a part of BrainStrain '26. See you there! 💙</p>
      <p>Best regards,<br/>Team BrainStrain '26<br/>Government College of Technology, Coimbatore</p>
    `,
  });
}

export function sendReminderEmail(reg) {
  return send({
    to: reg.email,
    subject: "BrainStrain '26 is Tomorrow! 🎉",
    html: `
      <p>Dear Participant,</p>
      <p>The wait is finally over — BrainStrain '26 is TOMORROW! 🎉🧠</p>
      <p>We're incredibly excited to have you join us for a day packed with challenges, creativity, strategy, and, of course, some serious brainpower! 🔥</p>
      <p>📌 Your BrainStrain '26 ID: <strong>${reg.participantId}</strong><br/>
      📅 Date: <strong>${EVENT_DATE}</strong><br/>
      📍 Venue: <strong>${EVENT_VENUE}</strong><br/>
      ⏰ Reporting Time: <strong>${EVENT_REPORTING_TIME}</strong></p>
      <p>Please make sure to arrive on time and keep your BS ID handy for a smooth registration process.</p>
      <p>Get ready to Think. Challenge. Conquer. 🚀</p>
      <p>See you tomorrow! 💙</p>
      <p>Best regards,<br/>Team BrainStrain '26<br/>Government College of Technology, Coimbatore</p>
    `,
  });
}
