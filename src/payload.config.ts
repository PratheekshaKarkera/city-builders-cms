import { mongooseAdapter } from '@payloadcms/db-mongodb'
import dns from 'dns'

// Set Google DNS servers to fix MongoDB Atlas SRV lookup issues
dns.setServers(['8.8.8.8', '8.8.4.4'])

import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig, type PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'
import { openapi, scalar, swaggerUI } from 'payload-oapi'
import { resendAdapter } from '@payloadcms/email-resend'
import { auditLogPlugin } from '@rumess/payload-audit-log'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { ServerLogs } from './collections/ServerLogs'
import { Enquiry } from './collections/Enquiry'
import { EnquirySettings } from './globals/EnquirySettings'
import { InteriorPage } from './globals/InteriorPage'

// Seed imports (removed bank-specific seeds)
// import { seedFaqs, seedEnquirySettings } from './utils/seed'

import { getCustomSpec } from './utils/generateSpec'
import { Projects } from './collections/Projects'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const logLevel = process.env.LOG_LEVEL || 'info'

export default buildConfig({
  logger: {
    options: {
      enabled: true,
      level: logLevel,
      name: 'city-builders-cms',
    },
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    routes: {
      login: '/login',
      createFirstUser: '/create-first-user',
      forgot: '/forgot',
      reset: '/reset-password',
      logout: '/logout',
    },
    components: {
      graphics: {
        Icon: '/components/Branding/Icon#Icon',
        Logo: '/components/Branding/Logo#Logo',
      },
    },
    meta: {
      titleSuffix: '- City Builders',
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/logo/logo-new.png',
        },
      ],
    },
  },
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000' || 'http://localhost:4321' || process.env.CLIENT_URL ||'http://localhost:3001',
  upload: {
    limits: {
      fileSize: 52428800, // 50MB
    },
  },
  collections: [
    Users,
    ServerLogs,
    Media,
    Enquiry,
    Projects,
  ],

  cors: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || '',
    'http://localhost:3000',
    `http://localhost:${process.env.PORT || 3000}`,
    'http://localhost:3001',
    'http://192.168.1.11:3000',
    'http://localhost:4321',
    process.env.CLIENT_URL || '',
    'https://ff2e-122-166-77-93.ngrok-free.app'
  ].filter(Boolean),
  csrf: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || '',
    'http://localhost:3000',
    `http://localhost:${process.env.PORT || 3000}`,
    'http://localhost:3001',
    'http://192.168.1.11:3000',
    'http://localhost:4321',
    process.env.CLIENT_URL || '',
    'https://ff2e-122-166-77-93.ngrok-free.app'
  ].filter(Boolean),
  globals: [
    EnquirySettings,
    InteriorPage,
  ],
  onInit: async (payload) => {
    payload.logger.info({ logLevel }, 'Payload initialization started')

    try {
      // Temporarily disabled seed logic while refactoring
      // await seedEnquirySettings(payload)
      // await seedHome(payload)
      // await seedNews(payload)
      // await seedFaqs(payload)

      payload.logger.info('Payload initialization completed')
    } catch (error: unknown) {
      payload.logger.error({ error }, 'Payload initialization failed')
      throw error
    }
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  email: resendAdapter({
    defaultFromAddress: process.env.RESEND_FROM || 'no-reply@citybuilders.com',
    defaultFromName: 'City Builders Admin',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.CLOUDFLARE_BUCKET || '',
      config: {
        region: process.env.CLOUDFLARE_REGION || 'auto',
        endpoint: process.env.CLOUDFLARE_ENDPOINT || undefined,
        credentials: process.env.CLOUDFLARE_ACCESS_KEY_ID && process.env.CLOUDFLARE_SECRET_ACCESS_KEY ? {
          accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
          secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
        } : undefined,
      },
    }),
    openapi({
      metadata: {
        title: 'City Builders API',
        version: '1.0.0',
      },
    }),
    scalar({
      docsUrl: '/scalar',
      specEndpoint: '/openapi-custom',
    }),
    auditLogPlugin({
      collections: [
        'media',
        'enquiry',
        'projects',
      ],
      includeAuth: true,
    }),
    (config) => {
      const auditLogCollection = config.collections?.find((c) => c.slug === 'audit-logs')
      if (auditLogCollection) {
        auditLogCollection.access = {
          ...auditLogCollection.access,
          create: () => false,
        }
        auditLogCollection.admin = {
          ...auditLogCollection.admin,
          hideAPIURL: true,
        }
      }
      return config
    },
  ],
  endpoints: [
    {
      path: '/openapi-custom',
      method: 'get',
      handler: async (req) => {
        try {
          const spec = await getCustomSpec(req as PayloadRequest)
          return Response.json(spec)
        } catch (error: unknown) {
          console.error('Error in /openapi-custom:', error)
          return Response.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 },
          )
        }
      },
    },
    {
      path: '/scalar',
      method: 'get',
      handler: async (req) => {
        const host = req.headers.get('host')
        const protocol = host?.includes('localhost') ? 'http' : 'https'
        const fullSpecUrl = `${protocol}://${host}/api/openapi-custom`
        const html = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>API Docs - Scalar</title>
            <script>
              document.addEventListener('DOMContentLoaded', function () {
                const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                const script = document.createElement('script');
                script.id = 'api-reference';
                script.src = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference';
                script.setAttribute('data-url', '${fullSpecUrl}');
                script.setAttribute('data-theme', theme);
                document.body.appendChild(script);
              });
            </script>
          </head>
          <body>
            <div id="scalar-api"></div>
          </body>
          </html>`
        return new Response(html, { headers: { 'content-type': 'text/html' } })
      },
    },
  ],
})
