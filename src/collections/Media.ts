import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'
import { writeServerLog } from '../utils/serverLogs'

const responsiveBreakpoints = [
  { name: 'thumbnail', width: 320 },
  { name: 'small', width: 640 },
  { name: 'medium', width: 1024 },
  { name: 'large', width: 1600 },
  { name: 'xl', width: 2400 },
] as const

const webpQuality = 82
const avifQuality = 60

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    hideAPIURL: true,
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeOperation: [
      async ({ args, operation }) => {
        if (operation === 'create' || operation === 'update') {
          await writeServerLog({
            event: 'media.upload.operation_started',
            message: `Media ${operation} request reached Payload`,
            req: args.req,
            details: {
              operation,
              contentLength: args.req.headers.get('content-length'),
              contentType: args.req.headers.get('content-type'),
              referer: args.req.headers.get('referer'),
            },
          })
        }

        return args
      },
    ],
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (operation === 'create' || operation === 'update') {
          await writeServerLog({
            event: 'media.upload.file_processed',
            message: 'Media file parsed and image sizes generated',
            req,
            details: {
              operation,
              filename: data?.filename,
              mimeType: data?.mimeType,
              filesize: data?.filesize,
              generatedSizes: data?.sizes ? Object.keys(data.sizes) : [],
            },
          })
        }

        return data
      },
    ],
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' || operation === 'update') {
          await writeServerLog({
            event: 'media.upload.before_db_save',
            message: 'Media metadata is ready to save in database',
            req,
            details: {
              operation,
              filename: data?.filename,
              filesize: data?.filesize,
              prefix: data?.prefix,
            },
          })
        }

        // Detect referer to apply stricter limits for specific modules
        const headers = req.headers as any
        const referer = typeof headers?.get === 'function' ? headers.get('referer') : headers?.referer
        const isResume = referer && referer.includes('career-applications')
        const sizeLimit = isResume ? 5 * 1024 * 1024 : 50 * 1024 * 1024
        const limitText = isResume ? '5MB' : '50MB'

        if (req.file && req.file.size > sizeLimit) {
          await writeServerLog({
            level: 'warn',
            event: 'media.upload.file_too_large',
            message: `Media upload rejected because file is larger than ${limitText}`,
            req,
            details: {
              filename: req.file.name,
              filesize: req.file.size,
              limit: sizeLimit,
              context: isResume ? 'career-application' : 'general',
            },
          })
          throw new Error(`File size is too large. Maximum allowed size for this type is ${limitText}.`)
        }

        try {
          if (operation === 'create' || operation === 'update') {
            // Safely get the referer to detect which collection we're uploading from
            const headers = req.headers as any
            const referer = typeof headers?.get === 'function' 
              ? headers.get('referer') 
              : headers?.referer

            if (referer && (!data.category || data.category === 'media')) {
              // Match either collections or globals from the referer URL
              const match = referer.match(/\/admin\/(collections|globals)\/([^\/?#]+)/)
              
              if (match && match[2]) {
                const collectionSlug = match[2]
                
                // Map collection/global slugs to target categories
                const slugMap: Record<string, string> = {
                  // Blogs & News
                  'blogs': 'blogs',
                  'blog-types': 'blogs',
                  'news': 'news',
                  'news-tags': 'news',
                  'testimonials': 'testimonials',
                  'careers': 'careers',
                  'offers': 'offers',
                  'projects': 'projects',
                  
                  // About Us (Collections)
                  'about-us-senior-management': 'aboutUs',
                  'about-us-former-chairmen': 'aboutUs',
                  'about-us-branches': 'aboutUs',
                  'about-us-bulletins': 'bulletins',
                  
                  // About Us (Globals)
                  'vision-and-mission': 'aboutUs',
                  'history': 'aboutUs',
                  'chairman-message': 'aboutUs',
                  'shareholder-corner': 'aboutUs',
                  
                  // Home, Deposits, Loans
                  'home': 'hero',
                  'deposits': 'deposits',
                  'loans': 'loans',

                  'nre-corners': 'nreCorners',
                  'rtgs-neft': 'otherServices',
                  'services': 'otherServices',
                  'service-types': 'otherServices',
                  'service-charges': 'otherServices',
                  'atm-services': 'digitalBanking',
                  'mobile-banking': 'digitalBanking',
                  'positive-pay-system': 'digitalBanking',
                  'cyber-security-awareness': 'cyberSecurity',
                  'employee-engagement': 'employeeEngagement',
                  'sales-notice': 'salesNotice',
                  'career-applications': 'resumes',
                  'auctions': 'auctions',
                }
                
                if (slugMap[collectionSlug]) {
                  data.category = slugMap[collectionSlug]
                }
              }
            }

            // Set the S3 prefix: city-builders/public/<Category>
            const category = data.category || 'media'
            data.prefix = `city-builders/public/${category.toLowerCase()}`
          }
        } catch (error) {
          console.error('Media prefix hook error:', error)
          // Fallback to a safe prefix if something goes wrong
          if (!data.prefix) {
            data.prefix = 'city-builders/public/media'
          }
        }

        if (operation === 'create' || operation === 'update') {
          await writeServerLog({
            event: 'media.upload.cloud_upload_starting',
            message: 'Database save is next; cloud storage upload starts after the document is saved',
            req,
            details: {
              operation,
              filename: data?.filename,
              prefix: data?.prefix,
              generatedSizes: data?.sizes ? Object.keys(data.sizes) : [],
            },
          })
        }

        return data
      },
    ],
    afterOperation: [
      async ({ args, operation, result }) => {
        if (operation === 'create' || operation === 'update') {
          await writeServerLog({
            event: 'media.upload.completed',
            message: `Media ${operation} completed successfully`,
            req: args.req,
            details: {
              operation,
              id:
                result && typeof result === 'object' && 'id' in result
                  ? result.id
                  : undefined,
              filename:
                result && typeof result === 'object' && 'filename' in result
                  ? result.filename
                  : undefined,
            },
          })
        }

        return result
      },
    ],
  },
  fields: [
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'testimonials', value: 'testimonials' },
        { label: 'news', value: 'news' },
        { label: 'media', value: 'media' },
        { label: 'projects', value: 'projects' },
        { label:'aboutUs',value:'aboutUs'},
        { label: 'hero', value: 'hero' },
        { label:'deposits',value:'deposits'},
        { label: 'loans', value: 'loans' },
        { label:'bulletins',value:'bulletins'},
        { label: "nreCorners", value: "nreCorners" },
        { label: 'otherServices', value: 'otherServices' },
        { label: 'digitalBanking', value: 'digitalBanking' },
        { label: 'cyberSecurity', value: 'cyberSecurity' },
        { label: 'careers', value: 'careers' },
        { label: 'resumes', value: 'resumes' },
        { label: 'salesNotice', value: 'salesNotice' },
        { label: 'employeeEngagement', value: 'employeeEngagement' },
        { label: 'auctions', value: 'auctions' },
      ],
      defaultValue: 'media',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Provide a brief title of the image for accessibility and SEO purposes.',
      },
    },
    {
      name: 'filesize',
      label: 'File Size',
      type: 'number',
      validate: (val: number | null | undefined) => {
        if (val && val > 52428800) {
          return 'File size is too large. Maximum allowed size is 50MB.'
        }
        return true
      },
      admin: {
        readOnly: true,
        disabled: true,
        hidden: true,
      },
    },
    {
      name: 'prefix',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
  ],
  upload: {
    staticDir: 'media',
    disableLocalStorage: true,
    adminThumbnail: 'thumbnail',
    crop: false,
    focalPoint: false,
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
    resizeOptions: {
      fit: 'inside',
      withoutEnlargement: true,
    },
    imageSizes: [
      ...responsiveBreakpoints.map(({ name, width }) => ({
        name,
        width,
        fit: 'inside' as const,
        withoutEnlargement: true,
        formatOptions: {
          format: 'webp' as const,
          options: {
            quality: webpQuality,
          },
        },
      })),
      ...responsiveBreakpoints.map(({ name, width }) => ({
        name: `${name}Avif`,
        width,
        fit: 'inside' as const,
        withoutEnlargement: true,
        admin: {
          disableGroupBy: true,
          disableListColumn: true,
          disableListFilter: true,
        },
        formatOptions: {
          format: 'avif' as const,
          options: {
            quality: avifQuality,
          },
        },
      })),
    ],
  },
}
