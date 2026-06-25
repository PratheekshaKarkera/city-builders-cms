import type { CollectionConfig } from 'payload'
import { isAdmin, isSuperAdmin } from '../access'

export const ServerLogs: CollectionConfig = {
  slug: 'server-logs',
  defaultSort: '-createdAt',
  admin: {
    useAsTitle: 'message',
    defaultColumns: ['level', 'event', 'message', 'path', 'createdAt'],
    group: 'System',
    hideAPIURL: true,
  },
  access: {
    read: isAdmin,
    create: isSuperAdmin,
    update: () => false,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: 'level',
      type: 'select',
      required: true,
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Warn', value: 'warn' },
        { label: 'Error', value: 'error' },
      ],
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'event',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'message',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'method',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'path',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'requestId',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'details',
      type: 'json',
      admin: {
        readOnly: true,
      },
    },
  ],
}
