import type { GlobalConfig } from 'payload'
import { isAdmin } from '../access'

export const EnquirySettings: GlobalConfig = {
  slug: 'enquiry-settings',
  admin: {
    group: 'Form',
    hideAPIURL: true,
  },
  access: {
    read: () => true, // Public access
    update: isAdmin,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'countryCode',
          type: 'text',
          required: true,
          defaultValue: '+91',
          validate: (val: string | null | undefined) => {
            if (val && !/^\+?\d+$/.test(val)) {
              return 'Only numbers are allowed'
            }
            return true
          },
          hooks: {
            beforeChange: [
              ({ value }) => {
                if (value && typeof value === 'string') {
                  return value.replace(/^\+/, '')
                }
                return value
              },
            ],
            afterRead: [
              ({ value }) => {
                if (value && typeof value === 'string' && !value.startsWith('+')) {
                  return `+${value}`
                }
                return value
              },
            ],
          },
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'telephoneNumber',
      type: 'text',
      required: true,
    },
    {
      name: 'address',
      label: 'Office Address',
      type: 'group',
      fields: [
        {
          name: 'line1',
          type: 'text',
          required: true,
        },
        {
          name: 'line2',
          type: 'text',
        },
        {
          name: 'area',
          type: 'text',
          required: true,
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'state',
          type: 'text',
          required: true,
        },
        {
          name: 'pincode',
          type: 'text',
          required: true,
          validate: (value: string | null | undefined) => {
            if (!value) return 'Pincode is required.'
            if (/^\d{6}$/.test(value)) return true
            return 'Pincode must be a 6-digit number.'
          },
        },
        {
          name: 'mapLink',
          type: 'text',
        },
      ],
    },
    {
      name: 'links',
      label: 'Links',
      type: 'array',
      required: true,
      minRows: 4,
      maxRows: 10,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platformName',
              type: 'text',
              required: true,
              admin: { width: '33%' },
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              admin: { width: '34%' },
            },
            {
              name: 'iconName',
              type: 'text',
              required: true,
              admin: {
                width: '33%',
                description: 'Select an icon name from https://lucide.dev/icons/',
              },
            },
          ],
        },
      ],
    },
  ],
}
