import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null; // SMTP not configured — caller falls back to logging the link
  }
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
}

// Sends the reset-password link by email if SMTP is configured. If it isn't
// (e.g. local dev with no SMTP_* set), this logs the link to the server
// console instead so you can still test the flow end-to-end.
export const sendPasswordResetEmail = async (toEmail, resetUrl) => {
  const mailer = getTransporter();

  if (!mailer) {
    console.log(`\n[CoinsBlogs] SMTP not configured — password reset link for ${toEmail}:\n${resetUrl}\n`);
    return { delivered: false };
  }

  await mailer.sendMail({
    from: process.env.SMTP_FROM || `"CoinsBlogs" <no-reply@coinsblogs.app>`,
    to: toEmail,
    subject: "Reset your CoinsBlogs password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color:#5b4fe0;">Reset your password</h2>
        <p>We got a request to reset the password for your CoinsBlogs account.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;background:#5b4fe0;color:#fff;
             padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;">
            Reset password
          </a>
        </p>
        <p style="color:#888;font-size:13px;">This link expires in 30 minutes. If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  });

  return { delivered: true };
};

// Sends a welcome email right after signup (email/password OR Google) to
// the address the account was registered with. Same SMTP-not-configured
// fallback as the reset email — logs instead of throwing, so a missing
// SMTP setup never blocks signup itself.
export const sendWelcomeEmail = async (toEmail, fullName) => {
  const mailer = getTransporter();

  if (!mailer) {
    console.log(`\n[CoinsBlogs] SMTP not configured — welcome email skipped for ${toEmail}\n`);
    return { delivered: false };
  }

  try {
    await mailer.sendMail({
      from: process.env.SMTP_FROM || `"CoinsBlogs" <no-reply@coinsblogs.app>`,
      to: toEmail,
      subject: "Welcome to CoinsBlogs 👋",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color:#5b4fe0;">Welcome, ${fullName || "there"}!</h2>
          <p>Your CoinsBlogs account (${toEmail}) is ready to go.</p>
          <p>Jump back in and start a conversation whenever you're ready.</p>
          <p>
            <a href="${process.env.CLIENT_URL || "http://localhost:5173"}"
               style="display:inline-block;background:#5b4fe0;color:#fff;
               padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;">
              Open CoinsBlogs
            </a>
          </p>
          <p style="color:#888;font-size:13px;">If you didn't create this account, you can ignore this email.</p>
        </div>
      `,
    });
    return { delivered: true };
  } catch (error) {
    // A welcome email failing to send should never fail the signup itself.
    console.error("sendWelcomeEmail failed:", error.message);
    return { delivered: false };
  }
};
