import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    hideAPIURL: true,
  },
  access: {
    read: () => true,
    create: isSuperAdmin,
    update: isSuperAdmin,
    delete: isSuperAdmin,
  },
  auth: {
    forgotPassword: {
      generateEmailHTML: (args) => {
        const token = args?.token
        const req = args?.req
        const host = req?.headers?.get('host') || 'localhost:3000'
        const protocol = host.includes('localhost') ? 'http' : 'https'
        const serverURL = process.env.PAYLOAD_PUBLIC_SERVER_URL || `${protocol}://${host}`
        const resetPath = token ? `/admin/reset-password/${encodeURIComponent(token)}` : '/admin/reset-password'
        const resetPasswordURL = `${serverURL}${resetPath}`

        return `
          <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html dir="ltr" lang="en">
            <head>
              <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
              </style>
            </head>
            <body style="background-color:#F4F8F1; margin:0; padding:0; font-family: 'Inter', sans-serif;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #E0EADD; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 71, 146, 0.08);">
                <tr>
                  <td align="center" style="padding: 40px 0; background-color: #ffffff; border-bottom: 4px solid #004792;">
                    <div style="margin-bottom: 10px;">
                      <img src="${serverURL}/logo/logo-new.png" alt="City Builders" width="220" style="display: block; margin: 0 auto; max-width: 100%; height: auto;" />
                    </div>
                    <div style="font-size: 12px; color: #666666; margin-top: 5px; text-transform: uppercase; letter-spacing: 2px;">Trust Built Over Generations</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px; line-height: 1.6;">
                    <h2 style="color: #1A1A1A; font-size: 24px; font-weight: 700; margin-top: 0; text-align: center;">Password Reset Request</h2>
                    <p style="color: #4A4A4A; font-size: 16px; margin-bottom: 30px; text-align: center;">
                      You are receiving this because you (or someone else) have requested the reset of the password for your City Builders account.
                    </p>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center">
                          <a href="${resetPasswordURL}" style="display: inline-block; padding: 16px 40px; background-color: #004792; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 15px; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 12px rgba(0, 71, 146, 0.2);">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="color: #888888; font-size: 14px; margin-top: 40px; text-align: center;">
                      If you did not request this, please ignore this email and your password will remain unchanged.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px; background-color: #F9FBF8; border-top: 1px solid #E0EADD; text-align: center;">
                    <p style="color: #666666; font-size: 12px; margin: 0;">
                      &copy; 2026 City Builders. All rights reserved.
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

      },
      generateEmailSubject: () => 'Reset your City Builders Admin Password',
    },
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Super Admin', value: 'SUPERADMIN' },
        { label: 'Admin', value: 'ADMIN' },
      ],
      required: true,
      defaultValue: 'ADMIN',
    },
  ],
}
