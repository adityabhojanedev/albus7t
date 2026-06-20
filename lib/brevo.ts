/**
 * lib/brevo.ts
 *
 * Brevo (Sendinblue) transactional email utility — v2 SDK.
 * Uses BrevoClient().transactionalEmails.sendTransacEmail().
 *
 * NOTE: The client is created lazily per-call (not as a module-level singleton)
 * so that Next.js .env.local hot-reloads are always picked up without a
 * full server restart.
 */

import { BrevoClient } from "@getbrevo/brevo";

// baseUrl is safe to read at module load — it doesn't change between hot-reloads
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

/**
 * Returns a fresh BrevoClient reading BREVO_API_KEY from the current
 * process.env at the moment of the call.
 *
 * IMPORTANT — use the API key (starts with xkeysib-), NOT the SMTP key
 * (starts with xsmtpsib-). Find it in Brevo → Profile → SMTP & API → API Keys.
 */
function getBrevoClient(): BrevoClient {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error(
      "BREVO_API_KEY is not set in environment variables. " +
      "Add it to .env.local (use the API key starting with xkeysib-, not the SMTP key)."
    );
  }
  return new BrevoClient({ apiKey });
}

// ── Email HTML template ───────────────────────────────────────────────────────

function buildVerificationEmailHtml(verificationUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your Albus Universe account</title>
</head>
<body style="margin:0;padding:0;background-color:#0A0705;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0705;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#110B07;border:1px solid #2A1F15;border-radius:8px;overflow:hidden;max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1A0F08,#2A1505);padding:32px 40px;text-align:center;border-bottom:1px solid #2A1F15;">
              <h1 style="margin:0;font-size:28px;letter-spacing:6px;color:#C47C2B;font-family:Georgia,serif;text-transform:uppercase;">
                ALBUS UNIVERSE
              </h1>
              <p style="margin:8px 0 0;font-size:11px;letter-spacing:3px;color:#7A6A55;text-transform:uppercase;">
                One creator. Every side of the game.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h2 style="margin:0 0 16px;font-size:22px;color:#F5ECD7;font-weight:600;">
                Confirm your email address
              </h2>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#A09080;">
                Welcome to the Albus Universe! Click the button below to verify your email
                and activate your account. This link expires in
                <strong style="color:#E8A44A;">24 hours</strong>.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                <tr>
                  <td style="border-radius:4px;background-color:#C47C2B;">
                    <a href="${verificationUrl}"
                       target="_blank"
                       style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:700;color:#0A0705;text-decoration:none;letter-spacing:1px;border-radius:4px;">
                      Verify My Account &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:13px;color:#7A6A55;">
                Or paste this link into your browser:
              </p>
              <p style="margin:0;font-size:12px;color:#C47C2B;word-break:break-all;">
                <a href="${verificationUrl}" style="color:#C47C2B;">${verificationUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 32px;border-top:1px solid #1A0F08;">
              <p style="margin:0;font-size:12px;color:#5A4A3A;line-height:1.6;">
                If you didn&apos;t create an account, you can safely ignore this email.<br/>
                This is an automated message — please don&apos;t reply.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Send an email-verification link to the given address.
 * @param toEmail  Recipient's email address
 * @param token    The raw hex token stored in the DB
 */
export async function sendVerificationEmail(
  toEmail: string,
  token: string
): Promise<void> {
  const verificationUrl = `${baseUrl}/api/verify-email?token=${token}`;
  const brevo = getBrevoClient();

  try {
    await brevo.transactionalEmails.sendTransacEmail({
      subject: "Verify your Albus Universe account",
      htmlContent: buildVerificationEmailHtml(verificationUrl),
      sender: { name: "Albus Universe", email: "noreply@albus7t.in" },
      to: [{ email: toEmail }],
      // Plain-text fallback for clients that don't render HTML
      textContent: `Welcome to Albus Universe!\n\nVerify your account by visiting:\n${verificationUrl}\n\nThis link expires in 24 hours.`,
    });
  } catch (err: unknown) {
    // Re-classify the error so callers and logs get a clear signal
    const statusCode = (err as { statusCode?: number })?.statusCode;

    if (statusCode === 401 || statusCode === 403) {
      // Wrong key or key type — this is a server configuration problem
      const hint =
        "Check BREVO_API_KEY in .env.local. " +
        "Use the API key (xkeysib-...) from Brevo → Profile → SMTP & API → API Keys tab, " +
        "NOT the SMTP key (xsmtpsib-...) from the SMTP tab.";
      console.error(`[brevo] Auth failure (${statusCode}) — ${hint}`);
      throw Object.assign(new Error(`Email service auth failed (${statusCode}). ${hint}`), {
        isEmailConfigError: true,
        statusCode,
      });
    }

    if (typeof statusCode === "number" && statusCode >= 500) {
      // Transient Brevo outage
      console.error(`[brevo] Transient send failure (${statusCode}):`, err);
      throw Object.assign(new Error(`Email service temporarily unavailable (${statusCode}). Please try again.`), {
        isEmailTransientError: true,
        statusCode,
      });
    }

    // Unknown error — re-throw as-is
    throw err;
  }
}
