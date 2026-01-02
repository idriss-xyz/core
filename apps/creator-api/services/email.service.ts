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
  <title>Continue Your IDRISS Signup</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F6F7F8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F6F7F8;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #E7F5E7 0%, #B8FB9B 100%); padding: 32px 40px; text-align: center;">
              <img src="https://idriss.xyz/idriss-dark-logo.svg" alt="IDRISS" width="120" style="display: inline-block;">
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 500; color: #000A05; line-height: 1.3;">
                Continue on Desktop
              </h1>
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #323D37;">
                You requested a link to complete your IDRISS signup on desktop. Click the button below to pick up where you left off.
              </p>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 8px 0 32px 0;">
                    <a href="${SIGNUP_LINK}" target="_blank" style="display: inline-block; background-color: #5FEB3C; color: #000A05; text-decoration: none; font-size: 14px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; padding: 16px 32px; border-radius: 12px;">
                      CONTINUE SIGNUP
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Steps -->
              <div style="background-color: #FAFFF5; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <p style="margin: 0 0 16px 0; font-size: 14px; font-weight: 500; color: #000A05;">
                  How to get started:
                </p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 8px 0; vertical-align: top;">
                      <table role="presentation" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="width: 28px; height: 28px; background-color: #5FEB3C; border-radius: 50%; text-align: center; vertical-align: middle; font-size: 14px; font-weight: 500; color: #000A05;">1</td>
                          <td style="padding-left: 12px; font-size: 14px; color: #323D37; line-height: 1.5;">Click the button above on your desktop or laptop</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; vertical-align: top;">
                      <table role="presentation" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="width: 28px; height: 28px; background-color: #5FEB3C; border-radius: 50%; text-align: center; vertical-align: middle; font-size: 14px; font-weight: 500; color: #000A05;">2</td>
                          <td style="padding-left: 12px; font-size: 14px; color: #323D37; line-height: 1.5;">Login with Twitch</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; vertical-align: top;">
                      <table role="presentation" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="width: 28px; height: 28px; background-color: #5FEB3C; border-radius: 50%; text-align: center; vertical-align: middle; font-size: 14px; font-weight: 500; color: #000A05;">3</td>
                          <td style="padding-left: 12px; font-size: 14px; color: #323D37; line-height: 1.5;">Complete your profile and start receiving tips</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              <p style="margin: 0; font-size: 14px; color: #656D69; line-height: 1.5;">
                If you didn't request this email, you can safely ignore it.
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
                <a href="https://idriss.xyz" style="color: #176410; text-decoration: none;">idriss.xyz</a>
              </p>
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
    Source: SES_FROM_EMAIL,
    Destination: {
      ToAddresses: [recipientEmail],
    },
    Message: {
      Subject: {
        Data: 'Finish setting up IDRISS on desktop',
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
    console.error(`[EMAIL] Failed to send signup guide to ${recipientEmail}:`, error);
    return false;
  }
}
