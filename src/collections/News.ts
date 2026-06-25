import type { Access, CollectionConfig, Where } from 'payload'
import { isAdmin } from '../access'
import formatSlug from '../utils/formatSlug'
import { populateSeoDescription, populateSeoTitle } from '../utils/seo'
import { 
  lexicalEditor, 
  HeadingFeature, 
  FixedToolbarFeature, 
  UnorderedListFeature, 
  HTMLConverterFeature 
} from '@payloadcms/richtext-lexical'

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'createdAt', 'tag'],
    //group: 'News',
  },
  access: {
    // Admins can perform all actions
    // Public users can only read published news
    read: (({ req: { user } }) => {
      if (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') {
        return true
      }
      return {
        status: {
          equals: 'published',
        },
      }
    }) as Access,
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
        const where: Where = isAdminUser ? {} : {
          status: {
            equals: 'published',
          },
        }

        try {
          const result = await payload.find({
            collection: 'news',
            where,
            depth: 1,
            sort: '-createdAt',
          })
          return Response.json(result)
        } catch (error: unknown) {
          payload.logger.error('Error fetching news list: ' + error)
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
        const where: Where = {
          slug: {
            equals: slug,
          },
          ...(isAdminUser ? {} : { status: { equals: 'published' } }),
        }

        try {
          const result = await payload.find({
            collection: 'news',
            where,
            depth: 1,
          })

          if (!result.docs.length) {
            return Response.json({ message: 'News not found' }, { status: 404 })
          }

          return Response.json(result.docs[0])
        } catch (error: unknown) {
          payload.logger.error('Error fetching news by slug: ' + error)
          return Response.json({ message: 'Internal Server Error' }, { status: 500 })
        }
      },
    },
  ],
  fields: [
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      required: true,
      index: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 100,
      admin: {
        description: 'Maximum 100 characters allowed.',
      },

    },
    {
      name: 'shortDescription',
      type: 'text',
      required: true,
      maxLength: 180,
      admin: {
        description: 'Maximum 180 characters allowed.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlug('title')],
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) {
              return new Date().toISOString()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: '16:9 aspect ratio recommended.',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      required: true,
      admin: {
        description: 'Select or create news categories/tags.',
      },
    },
    {
      name:'images',
      type:'array',
      fields:[
        {
          name:'image',
          type:'upload',
          relationTo:'media',
          admin:{
            description:'1:1 aspect ratio recommended.',
          },
        },
      ]
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures.filter((f) => f.key !== 'upload'),
          FixedToolbarFeature(),
          HeadingFeature({
            enabledHeadingSizes: ['h2', 'h3', 'h4'],
          }),
        ],
      }),
      required: true,
    },
    {
      name: 'summaryHighlights',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          FixedToolbarFeature(),
          UnorderedListFeature(),
          HTMLConverterFeature({}),
        ],
      }),
      admin: {
        description: 'Summary highlights (Bullet points only). Optional.',
      },
    },
    {
      name: 'seoTitle',
      type: 'text',
      required: true,
      hooks: {
        beforeValidate: [populateSeoTitle],
      },
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      required: true,
      hooks: {
        beforeValidate: [populateSeoDescription],
      },
    },
    {
      name: 'keywords',
      type: 'relationship',
      relationTo: 'keywords',
      hasMany: true,
      required: true,
      admin: {
        description: 'Select existing keywords or create new ones.',
      },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Social sharing image (Open Graph). 1200 x 630 pixels recommended.',
      },
    },
  ],
}
