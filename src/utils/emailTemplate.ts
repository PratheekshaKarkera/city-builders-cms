export const getEmailTemplate = ({
  title,
  content,
  buttonText,
  buttonURL,
}: {
  title: string
  content: string
  buttonText?: string
  buttonURL?: string
}) => {
  const buttonHtml =
    buttonText && buttonURL
      ? `
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center">
            <a href="${buttonURL}" style="display: inline-block; padding: 16px 40px; background-color: #0054A6; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 15px; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 12px rgba(0, 84, 166, 0.2);">
              ${buttonText}
            </a>
          </td>
        </tr>
      </table>
    `
      : ''

  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html dir="ltr" lang="en">
      <head>
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
        </style>
      </head>
      <body style="background-color:#F8FAFC; margin:0; padding:0; font-family: 'Inter', sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #E2E8F0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 84, 166, 0.08);">
          <tr>
            <td align="center" style="padding: 40px 0; background-color: #ffffff; border-bottom: 4px solid #0054A6;">
              <img src="${process.env.LOGO_URL || 'https://mcc-bank-website-dev.mccbank.workers.dev/logo/mcc-logo-2.jpg'}" alt="MCC Bank" width="200" style="display: block; margin: 0 auto;" />
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px; line-height: 1.6;">
              <h2 style="color: #1A1A1A; font-size: 24px; font-weight: 700; margin-top: 0; text-align: center;">${title}</h2>
              <div style="color: #4A4A4A; font-size: 16px; margin-bottom: 30px; text-align: center;">
                ${content}
              </div>
              ${buttonHtml}
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; background-color: #F9FBFF; border-top: 1px solid #E2E8F0; text-align: center;">
              <p style="color: #666666; font-size: 12px; margin: 0;">
                &copy; 2026 MCC Bank. All rights reserved.
              </p>
              <p style="color: #999999; font-size: 11px; margin-top: 5px;">
                Trust Built Over Generations
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

export const getAdminEmailTemplate = ({
  title,
  name,
  email,
  phone,
  message,
}: {
  title: string
  name: string
  email: string
  phone: string
  message: string
}) => {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html dir="ltr" lang="en">
      <head>
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
          @media only screen and (max-width: 480px) {
            .mobile-stack { display: block !important; width: 100% !important; margin: 10px 0 !important; text-align: left !important; }
            .desktop-sep { display: none !important; }
          }
        </style>
      </head>
      <body style="background-color:#F8FAFC; margin:0; padding:0; font-family: 'Inter', sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #E2E8F0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 84, 166, 0.08);">
          <tr>
            <td align="center" style="padding: 40px 0; background-color: #ffffff; border-bottom: 4px solid #0054A6;">
              <img src="${process.env.LOGO_URL || 'https://mcc-bank-website-dev.mccbank.workers.dev/logo/mcc-logo-2.jpg'}" alt="MCC Bank" width="200" style="display: block; margin: 0 auto;" />
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <div style="font-size: 12px; font-weight: 700; color: #0054A6; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; text-align: center;">
                INTERNAL NOTIFICATION
              </div>
              <h1 style="color: #0F172A; font-size: 32px; font-weight: 700; margin: 0 0 40px 0; line-height: 1.1; text-align: center;">
                ${title}
              </h1>

              <div style="margin-bottom: 40px;">
                <div style="font-size: 13px; font-weight: 700; color: #0F172A; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">
                  CLIENT DETAILS
                </div>
                <div style="font-size: 20px; font-weight: 700; color: #0F172A; margin-bottom: 8px;">
                  ${name.toUpperCase()}
                </div>
                <div style="font-size: 15px; color: #0054A6; font-weight: 400; line-height: 1.5;">
                  <a href="mailto:${email}" style="color: #0054A6; text-decoration: underline;" class="mobile-stack">${email}</a> 
                  <span style="color: #CBD5E1; margin: 0 10px;" class="desktop-sep">|</span> 
                  <span style="color: #475569;" class="mobile-stack">${phone}</span>
                </div>
              </div>

              <div style="margin-bottom: 10px;">
                <div style="font-size: 13px; font-weight: 700; color: #0F172A; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">
                  MESSAGE OVERVIEW
                </div>
                <div style="font-size: 15px; color: #475569; line-height: 1.6; background-color: #F8FAFC; padding: 20px; border-radius: 8px; border: 1px solid #E2E8F0;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; background-color: #F9FBFF; border-top: 1px solid #E2E8F0; text-align: center;">
              <p style="color: #666666; font-size: 12px; margin: 0;">
                &copy; 2026 MCC Bank. All rights reserved.
              </p>
              <p style="color: #999999; font-size: 11px; margin-top: 5px;">
                Trust Built Over Generations
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}
