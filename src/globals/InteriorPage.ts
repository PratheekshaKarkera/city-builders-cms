import { GlobalConfig } from 'payload'

export const InteriorPage: GlobalConfig = {
  slug: 'interior-page',
  label: 'Interior Page',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero Section',
          fields: [
            {
              name: 'heroSlides',
              type: 'array',
              label: 'Hero Slides',
              minRows: 1,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  admin: {
                    description: 'Background image for the slide',
                  },
                },
                {
                  name: 'badge',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'e.g., PREMIUM COLLECTION',
                  },
                },
                {
                  name: 'headline',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'e.g., Elevate Your Everyday Living Experience',
                  },
                },
                {
                  name: 'subtext',
                  type: 'textarea',
                  required: true,
                  admin: {
                    description: 'e.g., Bespoke living room designs that combine comfort...',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Showcase Section',
          fields: [
            {
              name: 'showcaseDescription',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Text shown below the OUR INTERIOR MASTERPIECES heading',
              },
            },
            {
              name: 'showcaseProjects',
              type: 'array',
              label: 'Showcase Images',
              minRows: 1,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'category',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'e.g., Living Room, Kitchen',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'e.g., The Sky Penthouse Living Area',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Why Choose Us',
          fields: [
            {
              name: 'whyChooseDescription',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Text shown below the EXCELLENCE IN EVERY DETAIL heading',
              },
            },
            {
              name: 'whyChooseFeatures',
              type: 'array',
              label: 'Features',
              minRows: 1,
              fields: [
                {
                  name: 'icon',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Lucide icon name (e.g. Layout, ShieldCheck, Compass, Clock, Package, HeartHandshake)',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Testimonials',
          fields: [
            {
              name: 'testimonials',
              type: 'array',
              label: 'Testimonials',
              minRows: 1,
              fields: [
                {
                  name: 'initials',
                  type: 'text',
                  required: true,
                  admin: { description: 'e.g., AS' }
                },
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  admin: { description: 'e.g., ANJALI SHARMA' }
                },
                {
                  name: 'project',
                  type: 'text',
                  required: true,
                  admin: { description: 'e.g., SKY HIGH PENTHOUSE' }
                },
                {
                  name: 'rating',
                  type: 'number',
                  required: true,
                  min: 1,
                  max: 5,
                  defaultValue: 5,
                },
                {
                  name: 'quote',
                  type: 'textarea',
                  required: true,
                }
              ]
            }
          ]
        },
      ],
    },
  ],
}
