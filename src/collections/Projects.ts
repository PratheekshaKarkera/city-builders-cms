import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'status', 'location', 'updatedAt'],
  },
  access: {
    read: () => true, // Anyone can read projects (needed for frontend)
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ data, operation, value }) => {
            if (operation === 'create' || (operation === 'update' && !value)) {
              if (data?.name && typeof data.name === 'string') {
                return data.name
                  .toLowerCase()
                  .replace(/ /g, '-')
                  .replace(/[^\w-]+/g, '')
              }
            }
            return value
          },
        ],
      },
    },
    {
      name: 'type',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g., Residential, Commercial',
      },
    },
    {
      name: 'location',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Ongoing', value: 'ongoing' },
        { label: 'Completed', value: 'completed' },
      ],
      defaultValue: 'ongoing',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'details',
      type: 'array',
      label: 'Project Details',
      labels: {
        singular: 'Detail',
        plural: 'Details',
      },
      fields: [
        {
          name: 'key',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., Area, Configuration, Units, RERA Number',
          },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., 2000 sq ft, 2BHK/3BHK, 50, PRM/KA/RERA/...',
          },
        },
      ],
      admin: {
        description: 'Add dynamic details specific to this project.',
      },
    },
  ],
}
