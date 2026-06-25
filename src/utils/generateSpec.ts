import { generateV30Spec } from 'payload-oapi/dist/openapi/generators.js'
import type { PayloadRequest } from 'payload'

export async function getCustomSpec(req: PayloadRequest) {
  const spec = (await generateV30Spec(req, {
    openapiVersion: '3.0',
    authEndpoint: '/users/login',
    metadata: {
      title: 'City Builders API',
      version: '1.0.0',
    },
  })) as Record<string, any>

  const clientSlugs = [
    'media',
    'enquiry',
    'news',
    'news-tags',
    'faq',
    'projects'
  ]

  // Manually add custom endpoints that the generator might miss
  if (!spec.paths) spec.paths = {}
  
  if (!spec.paths['/api/news/get-by-slug/{slug}']) {
    spec.paths['/api/news/get-by-slug/{slug}'] = {
      get: {
        summary: 'Get news by slug',
        description: 'Fetch a single news article using its unique slug.',
        tags: ['news'],
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'The slug of the news to retrieve',
          },
        ],
        responses: {
          '200': { 
            description: 'The news object',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
          '404': { description: 'News not found' },
        },
      },
    }
  }

  if (!spec.paths['/api/news/list']) {
    spec.paths['/api/news/list'] = {
      get: {
        summary: 'Get all news articles',
        description: 'Fetch the list of all news articles. Public users only see published news.',
        tags: ['news'],
        responses: {
          '200': { 
            description: 'The list of news objects',
            content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/faq/get-by-slug/{slug}']) {
    spec.paths['/api/faq/get-by-slug/{slug}'] = {
      get: {
        summary: 'Get faq by slug',
        description: 'Fetch a single faq entry using its unique slug.',
        tags: ['faq'],
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'The slug of the faq to retrieve',
          },
        ],
        responses: {
          '200': { 
            description: 'The faq object',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
          '404': { description: 'Faq not found' },
        },
      },
    }
  }

  if (!spec.paths['/api/faq/list']) {
    spec.paths['/api/faq/list'] = {
      get: {
        summary: 'Get all faq entries',
        description: 'Fetch the list of all faq entries.',
        tags: ['faq'],
        responses: {
          '200': { 
            description: 'The list of faq objects',
            content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/projects/list']) {
    spec.paths['/api/projects/list'] = {
      get: {
        summary: 'Get all projects',
        description: 'Fetch the list of all projects.',
        tags: ['Projects'],
        responses: {
          '200': { 
            description: 'The list of project objects',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/projects/get-by-slug/{slug}']) {
    spec.paths['/api/projects/get-by-slug/{slug}'] = {
      get: {
        summary: 'Get project by slug',
        description: 'Fetch a single project using its unique slug.',
        tags: ['Projects'],
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'The slug of the project to retrieve',
          },
        ],
        responses: {
          '200': { 
            description: 'The project object',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
          '404': { description: 'Project not found' },
        },
      },
    }
  }

  if (!spec.paths['/api/globals/enquiry-settings']) {
    spec.paths['/api/globals/enquiry-settings'] = {
      get: {
        summary: 'Get enquiry settings',
        description: 'Fetch global contact details like email and phone used for enquiries.',
        tags: ['enquiry'],
        responses: {
          '200': { 
            description: 'The enquiry settings object',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
        },
      },
    }
  }

  // Auth endpoints
  if (!spec.paths['/api/users/forgot-password']) {
    spec.paths['/api/users/forgot-password'] = {
      post: {
        summary: 'Forgot password',
        description: 'Initiate the password reset process by sending an email.',
        tags: ['users'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                },
                required: ['email'],
              },
            },
          },
        },
        responses: {
          '200': { 
            description: 'Success message',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/users/reset-password']) {
    spec.paths['/api/users/reset-password'] = {
      post: {
        summary: 'Reset password',
        description: 'Reset password using a token received via email.',
        tags: ['users'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  token: { type: 'string' },
                  password: { type: 'string' },
                },
                required: ['token', 'password'],
              },
            },
          },
        },
        responses: {
          '200': { 
            description: 'Success message',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
        },
      },
    }
  }

  // Remove internal Payload paths
  const internalPaths = [
    '/api/audit-logs',
    '/api/audit-logs/{id}',
    '/api/payload-kv',
    '/api/payload-kv/{id}',
    '/api/payload-locked-documents',
    '/api/payload-locked-documents/{id}',
    '/api/payload-migrations',
    '/api/payload-migrations/{id}',
    '/api/payload-preferences',
    '/api/payload-preferences/{id}',
    '/api/server-logs',
    '/api/server-logs/{id}',
    '/api//api/users/login',
    '/api/categories',
    '/api/categories/{id}',
    '/api/projects',
    '/api/projects/{id}',
    '/api/news',
    '/api/news/{id}',
    '/api/faq',
    '/api/faq/{id}',
    '/api/users',
    '/api/users/{id}',
    '/api/enquiry',
    '/api/enquiry/{id}',
    '/api/media',
    '/api/media/{id}'
  ]

  internalPaths.forEach(p => delete spec.paths[p])

  const clientTags = new Set<string>()
  const adminTags = new Set<string>()

  // Use for...of to allow async operations
  for (const pathKey of Object.keys(spec.paths || {})) {
    const pathItem = spec.paths[pathKey]
    const pathParts = pathKey.split('/')
    let slug = pathParts[2]
    
    // Handle globals (path is /api/globals/{slug})
    if (slug === 'globals') {
      slug = pathParts[3]
    }

    const clientGlobalSlugs = [
      'enquiry-settings',
    ]

    const isClientSlug = clientSlugs.includes(slug) || clientGlobalSlugs.includes(slug)

    // Try to fetch an example ID if the path requires an ID
    let exampleId = null
    if (pathKey.includes('{id}') && req.payload) {
      try {
        const { docs } = await req.payload.find({
          collection: slug as any,
          limit: 1,
          depth: 0,
        })
        if (docs?.[0]?.id) exampleId = docs[0].id
      } catch (_err) {
        // Ignore errors (e.g. if slug is not a valid collection or is a global)
      }
    }

    for (const method of Object.keys(pathItem)) {
      const operation = pathItem[method]
      if (typeof operation !== 'object' || !operation.tags) continue

      // Ensure 'id' parameter is defined for paths with {id}
      if (pathKey.includes('{id}')) {
        if (!operation.parameters) operation.parameters = []
        const hasId = operation.parameters.find(
          (p: { name: string; in: string; schema?: { example?: string } }) =>
            p.name === 'id' && p.in === 'path',
        )
        
        if (!hasId) {
          operation.parameters.push({
            name: 'id',
            in: 'path',
            description: 'The ID of the resource',
            required: true,
            schema: { type: 'string', example: exampleId },
          })
        } else if (exampleId && hasId.schema) {
           // Add example to existing parameter
           hasId.schema.example = exampleId
        }
      }

      let category = 'Admin'

      const isEnquirySlug = slug === 'enquiry' || slug === 'enquiry-settings'

      if (isEnquirySlug && (method === 'post' || method === 'get')) {
        // Enquiries have public POST, Settings have public GET
        category = 'Client'
        operation.security = []
      } else if (!isEnquirySlug && isClientSlug && method === 'get') {
        // Other client resources (blogs, products, etc.) only have public GET
        category = 'Client'
        operation.security = []
      }

      // Rename tags to include prefix for absolute separation
      operation.tags = operation.tags.map((t: string) => {
        const newTag = `${category}: ${t}`
        if (category === 'Client') clientTags.add(newTag)
        else adminTags.add(newTag)
        return newTag
      })
    }
  }

  spec['x-tagGroups'] = [
    {
      name: 'Client Resources',
      tags: Array.from(clientTags).sort(),
    },
    {
      name: 'Admin Panel Resources',
      tags: Array.from(adminTags).sort(),
    },
  ]

  return spec
}
