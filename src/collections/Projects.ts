import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'
import { 
  lexicalEditor, 
  HeadingFeature, 
  FixedToolbarFeature, 
  UnorderedListFeature, 
  HTMLConverterFeature 
} from '@payloadcms/richtext-lexical'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'status', 'location', 'updatedAt'],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') return true;
      return {
        _status: {
          equals: 'published',
        },
      };
    },
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  endpoints: [
    {
      path: '/list',
      method: 'get',
      handler: async (req) => {
        const { payload, user } = req
        const isAdminUser = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN'
        const where = isAdminUser ? {} : {
          _status: {
            equals: 'published',
          },
        }

        try {
          const result = await payload.find({
            collection: 'projects',
            where,
            depth: 1,
            sort: '-createdAt',
          })
          return Response.json(result.docs)
        } catch (error: unknown) {
          payload.logger.error('Error fetching projects list: ' + error)
          return Response.json({ message: 'Internal Server Error' }, { status: 500 })
        }
      },
    },
    {
      path: '/get-by-slug/:slug',
      method: 'get',
      handler: async (req) => {
        const { payload, user } = req
        const slug = req.routeParams?.slug

        if (!slug) {
          return Response.json({ message: 'Slug is required' }, { status: 400 })
        }

        const isAdminUser = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN'
        const where = {
          slug: {
            equals: slug,
          },
          ...(isAdminUser ? {} : { _status: { equals: 'published' } }),
        }

        try {
          const result = await payload.find({
            collection: 'projects',
            where,
            depth: 1,
          })

          if (!result.docs.length) {
            return Response.json({ message: 'Project not found' }, { status: 404 })
          }

          return Response.json(result.docs[0])
        } catch (error: unknown) {
          payload.logger.error('Error fetching project by slug: ' + error)
          return Response.json({ message: 'Internal Server Error' }, { status: 500 })
        }
      },
    },
  ],
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
        { label: 'Ready to Move', value: 'ready-to-move' },
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
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          UnorderedListFeature(),
        ],
      }),
      admin: {
        description: 'Detailed description of the project.',
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        description: 'URL to a promotional video (e.g., YouTube, Vimeo).',
      },
    },
    {
      name: 'mapLocationUrl',
      type: 'text',
      admin: {
        description: 'Google Maps embed URL.',
      },
    },
    {
      name: 'brochure',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Upload the primary project brochure (PDF) for the Download Brochure button.',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
      admin: {
        description: 'Images for the project gallery slider.',
      },
    },
    {
      name: 'amenities',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'lucideIcon',
          type: 'text',
          admin: {
            description: 'Enter the Lucide icon name (e.g., wifi, car, home). Leave blank to use a custom image.',
          },
        },
        {
          name: 'customIcon',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Upload a custom SVG or image if not using a Lucide icon.',
          },
        },
      ],
    },
    {
      name: 'specifications',
      type: 'array',
      admin: {
        description: 'Structural and material specifications for the project.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., Flooring, Electrical, Kitchen',
          },
        },
        {
          name: 'excerpt',
          type: 'array',
          label: 'Points',
          admin: {
            description: 'Add multiple bullet points for this specification.',
          },
          fields: [
            {
              name: 'point',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'floorPlans',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          admin: {
            description: 'Optional text to display under the floor plan image.',
          },
        },
      ],
    },
    {
      name: 'landmarks',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'distance',
          type: 'text',
          required: true,
          admin: { description: 'e.g., 2 km or 10 mins' },
        },
      ],
    },
    {
      name: 'constructionProgress',
      type: 'array',
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'certificates',
      type: 'array',
      label: 'Certificates & Approvals',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., RERA Certificate, SBI Home Loan Approved, Brochure',
          },
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional logo (e.g., Bank logo or RERA logo).',
          },
        },
        {
          name: 'document',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'The actual PDF document for the customer to download.',
          },
        },
      ],
      admin: {
        description: 'Upload multiple certificates, bank approvals, or project documents.',
      },
    },
  ],
}
