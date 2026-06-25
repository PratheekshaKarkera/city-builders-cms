import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'

export const NewsTags: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    hidden:true,
    group: 'News',
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
}
