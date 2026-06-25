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
import {
  seedAboutUsBranches,
  seedAboutUsBulletins,
  seedAboutUsChairmanMessage,
  seedAboutUsFormerChairmen,
  seedAboutUsHistory,
  seedAboutUsSeniorManagement,
  seedAboutUsVisionAndMission,
  seedAboutUsShareholderCorner,
  seedAtmServices,
  seedCustomerCare,
  seedDeposites,
  seedEnquirySettings,
  seedFaqs,
  seedHome,
  seedLoans,
  seedMobileBanking,
  seedNews,
  seedNreCorners,
  seedPositivePaySystem,
  seedRtgsNeft,
  seedServiceCharges,
  seedCyberSecurityAwareness,
  seedEmployeeEngagement,
} from './utils/seed'
import { seedAuctions } from './utils/seed/auctions'
import { seedCareers } from './utils/seed/careers'
import { seedSalesNotice } from './utils/seed/salesNotice'
import { AboutUsVisionAndMission } from './globals/AboutUsVisionAndMission'
import { AboutUsHistory } from './globals/AboutUsHistory'
import { AboutUsChairmanMessage } from './globals/AboutUsChairmanMessage'
import { AboutUsSeniorManagement } from './collections/AboutUsSeniorManagement'
import { AboutUsFormerChairmen } from './collections/AboutUsFormerChairmen'
import { AboutUsBranches } from './collections/AboutUsBranches'
import { AboutUsBulletins } from './collections/AboutUsBulletins'
import { AboutUsShareholderCorner } from './globals/AboutUsShareholderCorner'
import { Home } from './collections/Home'
import { News } from './collections/News'
import { Deposits } from './collections/Deposits'
import { NewsTags } from './collections/NewsCategory'
import { Loans } from './collections/Loans'
import { ManagementDesignations } from './collections/ManagementDesignations'
import { Keywords } from './collections/Keywords'
import { getCustomSpec } from './utils/generateSpec'
import { NreCorners } from './collections/nreCorners'
import { RtgsNeft } from './globals/rtgsNeft'
import { Grievance } from './collections/Grievance'
import { Services } from './collections/services'
import { ServiceTypes } from './collections/serviceTypes'
import { AtmServices } from './globals/atmServices'
import { MobileBanking } from './globals/mobileBanking'
import { PositivePaySystem } from './globals/positivePaySystem'
import { FAQ } from './collections/FAQ'
import { CustomerCare } from './globals/CustomerCare'
import { ServiceCharges } from './globals/serviceCharges'
import { CyberSecurityTags } from './collections/CyberSecurityTags'
import { CyberSecurityAwareness } from './globals/CyberSecurityAwareness'
import { EmployeeEngagement } from './collections/EmployeeEngagement'
import { EmployeeEngagementCategories } from './collections/EmployeeEngagementCategories'
import { AuctionCategories } from './collections/AuctionCategories'
import { Auctions } from './collections/Auctions'
import { CareerDepartments } from './collections/CareerDepartments'
import { CareerProficiencies } from './collections/CareerProficiencies'
import { CareerApplications } from './collections/CareerApplications'
import { Careers } from './collections/Careers'
import { SalesNoticeMetadataKeys } from './collections/SalesNoticeMetadataKeys'
import { SalesNotice } from './collections/SalesNotice'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const logLevel = process.env.LOG_LEVEL || 'info'

export default buildConfig({
  logger: {
    options: {
      enabled: true,
      level: logLevel,
      name: 'mcc-bank-cms-admin',
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
      titleSuffix: '- MCC Bank',
      icons: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          url: '/logo/mcc-icon.png',
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
    News,
    NewsTags,
    ManagementDesignations,
    AboutUsSeniorManagement,
    AboutUsFormerChairmen,
    AboutUsBranches,
    AboutUsBulletins,
    Deposits,
    Loans,
    Home,
    Keywords,
    Services,
    ServiceTypes,
    FAQ,
    Grievance,
    CyberSecurityTags,
    EmployeeEngagement,
    EmployeeEngagementCategories,
    AuctionCategories,
    Auctions,
    CareerDepartments,
    CareerProficiencies,
    Careers,
    CareerApplications,
    SalesNoticeMetadataKeys,
    SalesNotice,
  ],

  cors: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || '',
    `http://localhost:${process.env.PORT || 3000}`,
    'http://localhost:3001',
    'http://192.168.1.11:3000',
    'http://localhost:4321',
    process.env.CLIENT_URL || '',
    'https://ff2e-122-166-77-93.ngrok-free.app'

  ].filter(Boolean),
  csrf: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || '',
    `http://localhost:${process.env.PORT || 3000}`,
    'http://localhost:3001',
    'http://192.168.1.11:3000',
    'http://localhost:4321',
    process.env.CLIENT_URL || '',
    'https://ff2e-122-166-77-93.ngrok-free.app'
  ].filter(Boolean),
  globals: [
    EnquirySettings,
    AboutUsVisionAndMission,
    AboutUsHistory,
    AboutUsChairmanMessage,
    AboutUsShareholderCorner,
    NreCorners,
    AtmServices,
    MobileBanking,
    PositivePaySystem,
    RtgsNeft,
    ServiceCharges,
    CustomerCare,
    CyberSecurityAwareness,
  ],
  onInit: async (payload) => {
    payload.logger.info({ logLevel }, 'Payload initialization started')

    try {
      await seedEnquirySettings(payload)
      await seedAboutUsVisionAndMission(payload)
      await seedAboutUsChairmanMessage(payload)
      await seedAboutUsSeniorManagement(payload)
      await seedAboutUsShareholderCorner(payload)
      await seedAboutUsFormerChairmen(payload)
      await seedAboutUsBranches(payload)
      await seedAboutUsBulletins(payload)
      await seedAboutUsHistory(payload)
      await seedDeposites(payload)
      await seedLoans(payload)
      await seedHome(payload)
      await seedNreCorners(payload)
      await seedNews(payload)
      await seedRtgsNeft(payload)
      await seedServiceCharges(payload)
      await seedAtmServices(payload)
      await seedMobileBanking(payload)
      await seedPositivePaySystem(payload)
      await seedFaqs(payload)
      await seedCustomerCare(payload)
      await seedCyberSecurityAwareness(payload)
      await seedEmployeeEngagement(payload)
      await seedAuctions(payload)
      await seedCareers(payload)
      await seedSalesNotice(payload)

      payload.logger.info('Payload initialization completed')
    } catch (error: unknown) {
      payload.logger.error({ error }, 'Payload initialization failed')
      throw error
    }
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  email: resendAdapter({
    defaultFromAddress: process.env.RESEND_FROM || 'no-reply@dev.exeloncircuits.in',
    defaultFromName: 'MCC Bank Admin',
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
        title: 'MCC Bank API',
        version: '1.0.0',
      },
    }),
    scalar({
      docsUrl: '/scalar',
      specEndpoint: '/openapi-custom',
    }),
    // swaggerUI({
    //   docsUrl: '/swagger',
    //   specEndpoint: '/openapi-custom',
    // }),
    auditLogPlugin({
      collections: [
        'media',
        'enquiry',
        'blogs',
        'testimonials',
        'blog-types',
        'news',
        'news-tags',
        'loans',
        'deposits',
        'services',
        'service-types',
        'nre-corners',
        'faq',
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
    {
      path: '/swagger',
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
            <title>API Docs - Swagger UI</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
          </head>
          <body>
            <div id="swagger-ui"></div>
            <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
            <script>
              window.onload = () => {
                window.ui = SwaggerUIBundle({
                  url: '${fullSpecUrl}',
                  dom_id: '#swagger-ui',
                  deepLinking: true,
                  presets: [SwaggerUIBundle.presets.apis],
                });
              };
            </script>
          </body>
          </html>`
        return new Response(html, { headers: { 'content-type': 'text/html' } })
      },
    },
  ],
})
