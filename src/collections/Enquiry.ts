import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'
import { getAdminEmailTemplate, getEmailTemplate } from '../utils/emailTemplate'

export const Enquiry: CollectionConfig = {
  slug: 'enquiry',
  defaultSort: '-createdAt',
  admin: {
    //defaultSort: '-createdAt',
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'email','countryCode', 'phone', 'createdAt'],
    hideAPIURL: true,
    group: 'Form',
  },
  access: {
    // Admins can read (GET) and delete, but cannot create or edit
    read: isAdmin,
    delete: isAdmin,
    // Allow public creation (unauthenticated) only from API, not Admin
    create: ({ req }) => {
      // If the request comes from the admin panel (referer check), deny creation
      const referer = req.headers.get('referer')
      if (referer && referer.includes('/admin')) {
        return false
      }
      return true
    },
    // Locked down: manual edits are forbidden
    update: () => false,
  },
  hooks: {
    afterChange: [
      ({ doc, operation, req }) => {
        if (operation === 'create' && doc.email) {
          const typeMap = {
            general_enquiry: {
              clientTitle: 'Thank You for Your Enquiry!',
              adminTitle: 'New Enquiry Received',
              subject: 'New Enquiry Received - City Builders',
            },
            interior_consultation: {
              clientTitle: 'Thank You for Your Interior Design Consultation Request!',
              adminTitle: 'New Interior Consultation Request',
              subject: 'New Interior Consultation Request - City Builders',
            },
            site_visit: {
              clientTitle: 'Thank You for Your Site Visit Request!',
              adminTitle: 'New Site Visit Request',
              subject: 'New Site Visit Request - City Builders',
            },
            brochure_request: {
              clientTitle: 'Thank You for Your Brochure Request!',
              adminTitle: 'New Brochure Request',
              subject: 'New Brochure Request - City Builders',
            }
          }
          const { clientTitle, adminTitle, subject } =
            typeMap[doc.type as keyof typeof typeMap] || typeMap.general_enquiry

          // Send "Thank You" email to the user
          req.payload.sendEmail({
            to: doc.email,
            bcc: process.env.BCC_EMAIL,
            subject: 'Thank you for your enquiry - City Builders',
            html: getEmailTemplate({
              title: clientTitle,
              content: `Dear ${doc.name},<br><br>Thank you for reaching out to City Builders. We have received your message and our team will get back to you as soon as possible.<br><br>Best Regards,<br>Team City Builders`,
            }),
          })

          // Send notification email to the admin
          if (process.env.ADMIN_EMAIL) {
            req.payload.sendEmail({
              to: process.env.ADMIN_EMAIL,
              bcc: process.env.BCC_EMAIL,
              subject: subject,
              html: getAdminEmailTemplate({
                title: adminTitle,
                name: doc.name,
                email: doc.email,
                phone: `${doc.countryCode} ${doc.phone}`,
                message: doc.message,
              }),
            })
          }
        }
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: { readOnly: true },
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          admin: { readOnly: true },
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'General Enquiry', value: 'general_enquiry' },
            { label: 'Interior Design Consultation', value: 'interior_consultation' },
            { label: 'Project Site Visit', value: 'site_visit' },
            { label: 'Brochure Request', value: 'brochure_request' },
          ],
          admin: { readOnly: true },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'countryCode',
          type: 'text',
          required: true,
          admin: { readOnly: true },
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
          admin: { readOnly: true },
        },
      ],
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        readOnly: true,
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeValidate: [
          ({ value, operation }) => {
            if (operation === 'create') {
              return new Date().toISOString()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      admin: { readOnly: true },
    },
  ],
}
