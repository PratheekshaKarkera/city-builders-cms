import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'
import formatSlug from '../utils/formatSlug'

export const FAQ: CollectionConfig = {
  slug: 'faq',
  admin: {
    group: 'Other Pages',
    useAsTitle: 'title',
    hideAPIURL: true,
  },
  orderable: true,
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  endpoints: [
    {
      path: '/list',
      method: 'get',
      handler: async (req) => {
        const { payload } = req
        try {
          const result = await payload.find({
            collection: 'faq',
            depth: 2,
            sort: '-createdAt',
          })
          return Response.json(result.docs)
        } catch (error: unknown) {
          payload.logger.error('Error fetching FAQ list: ' + error)
          return Response.json({ message: 'Internal Server Error' }, { status: 500 })
        }
      },
    },
    {
      path: '/get-by-slug/:slug',
      method: 'get',
      handler: async (req) => {
        const { payload } = req
        const slug = req.routeParams?.slug

        if (!slug) {
          return Response.json({ message: 'Slug is required' }, { status: 400 })
        }

        try {
          const result = await payload.find({
            collection: 'faq',
            where: {
              slug: {
                equals: slug,
              },
            },
            depth: 2,
          })

          if (!result.docs.length) {
            return Response.json({ message: 'FAQ not found' }, { status: 404 })
          }

          return Response.json(result.docs[0])
        } catch (error: unknown) {
          payload.logger.error('Error fetching FAQ by slug: ' + error)
          return Response.json({ message: 'Internal Server Error' }, { status: 500 })
        }
      },
    },
  ],
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subTitle',
      type: 'text',
      required: true,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      maxLength: 151,
      admin: {
        description: 'Maximum 151 characters allowed.',
      },
    },
    {
      name: 'pageHeading',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      maxLength: 191,
      admin: {
        description: 'Maximum 191 characters allowed.',
      },
    },
    {
      name: 'faqCategories',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'category',
          type: 'text',
          required: true,
        },
        {
          name: 'questions',
          type: 'array',
          required: true,
          minRows: 1,
          fields: [
            {
              name: 'question',
              type: 'text',
              required: true,
            },
            {
              name: 'answer',
              type: 'textarea',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [formatSlug('title')],
      },
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier (e.g., loans-and-advances)',
      },
    },
  ],
}
