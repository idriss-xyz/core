import { SendEmailCommand } from '@aws-sdk/client-ses';
import { SES_CLIENT, SES_FROM_EMAIL } from '../config/aws-config';

const SIGNUP_LINK = 'https://idriss.xyz/?login=true';

function getSignupGuideEmailHtml(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Continue setting up IDRISS on desktop</title>
  <style>
    .cta-button:hover {
      background-color: #2AD012 !important;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F6F7F8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F6F7F8;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden;">

          <!-- Header banner -->
          <tr>
            <td style="padding: 0; text-align: center;">
              <img
                src="https://idriss.xyz/idriss-banner-image.png"
                alt=""
                width="520"
                height="173"
                style="display: block; width: 100%; max-width: 520px; height: auto;"
              />
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 500; color: #000A05; line-height: 1.3;">
                Continue the setup
              </h1>
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #323D37;">
                You requested a link to continue the setup on desktop. Click below to pick up where you left off.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 8px 0 32px 0;">
                    <a
                      href="${SIGNUP_LINK}"
                      target="_blank"
                      class="cta-button"
                      style="display: inline-block; background-color: #5FEB3C; color: #000A05; text-decoration: none; font-size: 14px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; padding: 16px 32px; border-radius: 12px;"
                    >
                      CONTINUE SETUP
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 14px; color: #656D69; line-height: 1.5;">
                If you did not request this email, you can safely ignore it.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #EBECEE; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #8F94A2;">
                © ${new Date().getFullYear()} IDRISS. All rights reserved.
              </p>

              <p style="margin: 0; font-size: 12px;">
                <a href="https://idriss.xyz" style="color: #176410; text-decoration: none;">
                  idriss.xyz
                </a>
              </p>

              <!-- Social icons -->
              <table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin: 16px auto 12px auto;">
                <tr>
                  <td style="padding: 0 8px;">
                    <a href="https://x.com/idriss_xyz" target="_blank">
                      <img src="https://idriss.xyz/email-icons/X.png" width="20" height="20" alt="X" style="display: block;">
                    </a>
                  </td>
                  <td style="padding: 0 8px;">
                    <a href="https://discord.com/invite/RJhJKamjw5" target="_blank">
                      <img src="https://idriss.xyz/email-icons/Discord.png" width="20" height="20" alt="Discord" style="display: block;">
                    </a>
                  </td>
                  <td style="padding: 0 8px;">
                    <a href="https://instagram.com/idriss_xyz" target="_blank">
                      <img src="https://idriss.xyz/email-icons/Instagram.png" width="20" height="20" alt="Instagram" style="display: block;">
                    </a>
                  </td>
                  <td style="padding: 0 8px;">
                    <a href="https://tiktok.com/@idriss_xyz" target="_blank">
                      <img src="https://idriss.xyz/email-icons/Tik-Tok.png" width="20" height="20" alt="TikTok" style="display: block;">
                    </a>
                  </td>
                  <td style="padding: 0 8px;">
                    <a href="https://www.youtube.com/@idriss_xyz" target="_blank">
                      <img src="https://idriss.xyz/email-icons/YouTube.png" width="20" height="20" alt="YouTube" style="display: block;">
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

function getSignupGuideEmailText(): string {
  return `
Continue Your IDRISS Signup
===========================

You requested a link to complete your IDRISS signup on desktop.

Click the link below to pick up where you left off:
${SIGNUP_LINK}

How to get started:
1. Open this link on your desktop or laptop
2. Login with Twitch
3. Complete your profile and start receiving tips

If you didn't request this email, you can safely ignore it.

---
© ${new Date().getFullYear()} IDRISS. All rights reserved.
https://idriss.xyz
`;
}

export async function sendSignupGuideEmail(
  recipientEmail: string,
): Promise<boolean> {
  const command = new SendEmailCommand({
    Source: `IDRISS <${SES_FROM_EMAIL}>`,
    Destination: {
      ToAddresses: [recipientEmail],
    },
    Message: {
      Subject: {
        Data: 'Continue setting up IDRISS on desktop',
        Charset: 'UTF-8',
      },
      Body: {
        Html: {
          Data: getSignupGuideEmailHtml(),
          Charset: 'UTF-8',
        },
        Text: {
          Data: getSignupGuideEmailText(),
          Charset: 'UTF-8',
        },
      },
    },
  });

  try {
    await SES_CLIENT.send(command);
    console.log(`[EMAIL] Signup guide sent to: ${recipientEmail}`);
    return true;
  } catch (error) {
    console.error(
      `[EMAIL] Failed to send signup guide to ${recipientEmail}:`,
      error,
    );
    return false;
  }
}
