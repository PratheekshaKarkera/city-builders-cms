import { generateV30Spec } from 'payload-oapi/dist/openapi/generators.js'
import type { PayloadRequest } from 'payload'

export async function getCustomSpec(req: PayloadRequest) {
  const spec = (await generateV30Spec(req, {
    openapiVersion: '3.0',
    authEndpoint: '/api/users/login',
    metadata: {
      title: 'MCC Bank API',
      version: '1.0.0',
    },
  })) as Record<string, any>

  const clientSlugs = [
    'media',
    'enquiry',
    'blogs',
    'news',
    'testimonials',
    'certifications',
    'partner-enquiry',
    'about-us-senior-management',
    'about-us-former-chairmen',
    'about-us-branches',
    'about-us-bulletins',
    'deposits',
    'loans',
    'home',
    'services',
    'faq',
    'grievance',
    'employee-engagement',
    'auctions',
    'careers',
    'sales-notice',
  ]

  // Manually add custom endpoints that the generator might miss
  if (!spec.paths) spec.paths = {}
  
  if (!spec.paths['/api/blogs/get-by-slug/{slug}']) {
    spec.paths['/api/blogs/get-by-slug/{slug}'] = {
      get: {
        summary: 'Get blog by slug',
        description: 'Fetch a single blog post using its unique slug.',
        tags: ['blogs'],
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'The slug of the blog to retrieve',
          },
        ],
        responses: {
          '200': { 
            description: 'The blog object',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
          '404': { description: 'Blog not found' },
        },
      },
    }
  }

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

  if (!spec.paths['/api/grievance']) {
    spec.paths['/api/grievance'] = {
      post: {
        summary: 'Submit grievance/feedback',
        description: 'Submit a new grievance or feedback form.',
        tags: ['grievance'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'countryCode', 'phone', 'accountNumber', 'existingCustomer', 'address'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  countryCode: { type: 'string' },
                  phone: { type: 'string' },
                  accountNumber: { type: 'string' },
                  branch: { type: 'string' },
                  existingCustomer: { type: 'boolean' },
                  address: { type: 'string' },
                  feedback: { type: 'string' },
                  complaint: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Grievance submitted successfully' },
          '400': { description: 'Invalid input' },
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

  if (!spec.paths['/api/globals/about-us-vision-and-mission']) {
    spec.paths['/api/globals/about-us-vision-and-mission'] = {
      get: {
        summary: 'Get About Us: Vision & Mission',
        description: 'Fetch About Us Vision, Mission and Objectives content.',
        tags: ['about-us'],
        responses: {
          '200': { 
            description: 'The About Us vision & mission object',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/globals/about-us-chairman-message']) {
    spec.paths['/api/globals/about-us-chairman-message'] = {
      get: {
        summary: 'Get About Us: Chairman Message',
        description: 'Fetch About Us Chairman Message content.',
        tags: ['about-us'],
        responses: {
          '200': { 
            description: 'The About Us chairman message object',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/globals/about-us-history']) {
    spec.paths['/api/globals/about-us-history'] = {
      get: {
        summary: 'Get About Us: History',
        description: 'Fetch the history of MCC Bank (4 key points).',
        tags: ['About Us History'],
        responses: {
          '200': { 
            description: 'The About Us History object',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/globals/about-us-shareholder-corner']) {
    spec.paths['/api/globals/about-us-shareholder-corner'] = {
      get: {
        summary: 'Get About Us: Shareholder Corner',
        description: 'Fetch Shareholder Corner policies and responsibilities.',
        tags: ['about-us'],
        responses: {
          '200': { 
            description: 'The Shareholder Corner object',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/home/list']) {
    spec.paths['/api/home/list'] = {
      get: {
        summary: 'Get all home banners',
        description: 'Fetch the list of all home page banners with title, description, image and CTAs.',
        tags: ['home'],
        responses: {
          '200': { 
            description: 'The list of home banner objects',
            content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/home/summary']) {
    spec.paths['/api/home/summary'] = {
      get: {
        summary: 'Get home page summary data',
        description: 'Fetch an aggregated summary of deposits and loans marked for display on the home page.',
        tags: ['home'],
        responses: {
          '200': { 
            description: 'The aggregated home summary object',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/about-us-former-chairmen']) {
    spec.paths['/api/about-us-former-chairmen'] = {
      get: {
        summary: 'Get About Us: Former Chairmen',
        description: 'Fetch About Us Former Chairmen content.',
        tags: ['About Us History'],
        responses: {
          '200': { 
            description: 'The About Us Former Chairmen object',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/about-us-branches']) {
    spec.paths['/api/about-us-branches'] = {
      get: {
        summary: 'Get Branch & ATM locator records',
        description: 'Fetch branch, ATM, and branch-with-ATM locator records. Supports filtering by city, IFSC code, branch type, location type, and active status.',
        tags: ['about-us'],
        responses: {
          '200': { 
            description: 'The list of branch and ATM locator records',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/about-us-bulletins']) {
    spec.paths['/api/about-us-bulletins'] = {
      get: {
        summary: 'Get About Us: Bulletins',
        description: 'Fetch the list of all monthly/yearly bulletins with PDF links.',
        tags: ['about-us'],
        responses: {
          '200': { 
            description: 'The list of bulletins',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/deposits/get-by-slug/{slug}']) {
    spec.paths['/api/deposits/get-by-slug/{slug}'] = {
      get: {
        summary: 'Get deposit by slug',
        description: 'Fetch a single deposit type using its unique slug.',
        tags: ['Deposits'],
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'The slug of the deposit to retrieve',
          },
        ],
        responses: {
          '200': { 
            description: 'The deposit object',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
          '404': { description: 'Deposit not found' },
        },
      },
    }
  }

  if (!spec.paths['/api/deposits/list']) {
    spec.paths['/api/deposits/list'] = {
      get: {
        summary: 'Get simplified list of deposits',
        description: 'Fetch all deposit types with only accountTypeName, slug, and shortDescription.',
        tags: ['Deposits'],
        responses: {
          '200': { 
            description: 'The list of simplified deposit objects',
            content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/loans/get-by-slug/{slug}']) {
    spec.paths['/api/loans/get-by-slug/{slug}'] = {
      get: {
        summary: 'Get loan by slug',
        description: 'Fetch a single loan type using its unique slug.',
        tags: ['Loans'],
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'The slug of the loan to retrieve',
          },
        ],
        responses: {
          '200': { 
            description: 'The loan object',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
          '404': { description: 'Loan not found' },
        },
      },
    }
  }

  if (!spec.paths['/api/loans/list']) {
    spec.paths['/api/loans/list'] = {
      get: {
        summary: 'Get simplified list of loans',
        description: 'Fetch all loan types with only loanTypeName, slug, and shortDescription.',
        tags: ['Loans'],
        responses: {
          '200': { 
            description: 'The list of simplified loan objects',
            content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/loans/all']) {
    spec.paths['/api/loans/all'] = {
      get: {
        summary: 'Get all loans with all fields',
        description: 'Fetch all loan types with all their fields.',
        tags: ['Loans'],
        responses: {
          '200': { 
            description: 'The list of full loan objects',
            content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } }
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

  if (!spec.paths['/api/services/list']) {
    spec.paths['/api/services/list'] = {
      get: {
        summary: 'Get all services',
        description: 'Fetch the list of all services with their names, types, and branch network details.',
        tags: ['Services'],
        responses: {
          '200': { 
            description: 'The list of service objects',
            content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/globals/rtgs-neft']) {
    spec.paths['/api/globals/rtgs-neft'] = {
      get: {
        summary: 'Get RTGS / NEFT guidelines',
        description: 'Fetch RTGS and NEFT transfer guidelines and unique bank identifiers.',
        tags: ['Other Services'],
        responses: {
          '200': { 
            description: 'The RTGS / NEFT global object',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/globals/service-charges']) {
    spec.paths['/api/globals/service-charges'] = {
      get: {
        summary: 'Get Service Charges',
        description: 'Fetch detailed service charges and policy documents.',
        tags: ['Other Services'],
        responses: {
          '200': { 
            description: 'The service charges global object',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/globals/nre-corners']) {
    spec.paths['/api/globals/nre-corners'] = {
      get: {
        summary: 'Get NRE Corners',
        description: 'Fetch NRE Corners account types, rates, and documentation.',
        tags: ['NRE Corners'],
        responses: {
          '200': { 
            description: 'The NRE corners global object',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/globals/atm-services']) {
    spec.paths['/api/globals/atm-services'] = {
      get: {
        summary: 'Get ATM Services',
        description: 'Fetch details about ATM services and minimum balance requirements.',
        tags: ['Digital Banking'],
        responses: {
          '200': { 
            description: 'The ATM Services global object',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/globals/mobile-banking']) {
    spec.paths['/api/globals/mobile-banking'] = {
      get: {
        summary: 'Get Mobile Banking',
        description: 'Fetch Mobile Banking features, screenshots, and security info.',
        tags: ['Digital Banking'],
        responses: {
          '200': { 
            description: 'The Mobile Banking global object',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/globals/positive-pay-system']) {
    spec.paths['/api/globals/positive-pay-system'] = {
      get: {
        summary: 'Get Positive Pay System',
        description: 'Fetch Positive Pay System details, manuals, and fraud prevention info.',
        tags: ['Digital Banking'],
        responses: {
          '200': { 
            description: 'The Positive Pay System global object',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
        },
      },
    }
  }

  // Remove standard CRUD paths that are replaced by custom client endpoints to avoid duplication
  delete spec.paths['/api/globals/cyber-security-awareness']
  delete spec.paths['/api/globals/auctions']
  delete spec.paths['/api/globals/customer-care']
  delete spec.paths['/api/auctions']
  delete spec.paths['/api/auctions/{id}']
  delete spec.paths['/api/careers']
  delete spec.paths['/api/careers/{id}']
  delete spec.paths['/api/career-applications']
  delete spec.paths['/api/career-applications/{id}']
  delete spec.paths['/api/sales-notice']
  delete spec.paths['/api/sales-notice/{id}']
  delete spec.paths['/api/employee-engagement']
  delete spec.paths['/api/employee-engagement/{id}']

  if (!spec.paths['/api/globals/cyber-security-awareness/get']) {
    spec.paths['/api/globals/cyber-security-awareness/get'] = {
      get: {
        summary: 'Get Cyber Security Awareness data',
        description: 'Fetch the Cyber Security Awareness global content including cards, common threads, and protection tips.',
        tags: ['cyber-security-awareness'],
        responses: {
          '200': { 
            description: 'The cyber security awareness object',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/auctions/list']) {
    spec.paths['/api/auctions/list'] = {
      get: {
        summary: 'Get all auctions',
        description: 'Fetch a list of all active and past auction notices.',
        tags: ['auctions'],
        responses: {
          '200': { 
            description: 'The list of auction objects',
            content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/auctions/get-by-slug/{slug}']) {
    spec.paths['/api/auctions/get-by-slug/{slug}'] = {
      get: {
        summary: 'Get auction by slug',
        description: 'Fetch a specific auction notice using its unique slug.',
        tags: ['auctions'],
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'The slug of the auction to retrieve',
          },
        ],
        responses: {
          '200': { 
            description: 'The auction object',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
          '404': { description: 'Auction not found' },
        },
      },
    }
  }

  if (!spec.paths['/api/careers/list']) {
    spec.paths['/api/careers/list'] = {
      get: {
        summary: 'Get all career opportunities',
        description: 'Fetch a list of all current job openings and management trainee programs.',
        tags: ['careers'],
        responses: {
          '200': { 
            description: 'The list of career objects',
            content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/careers/get-by-slug/{slug}']) {
    spec.paths['/api/careers/get-by-slug/{slug}'] = {
      get: {
        summary: 'Get career opportunity by slug',
        description: 'Fetch a specific job opening using its unique slug.',
        tags: ['careers'],
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'The slug of the job opening to retrieve',
          },
        ],
        responses: {
          '200': { 
            description: 'The career object',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
          '404': { description: 'Job opening not found' },
        },
      },
    }
  }

  if (!spec.paths['/api/sales-notice/list']) {
    spec.paths['/api/sales-notice/list'] = {
      get: {
        summary: 'Get all sales notices',
        description: 'Fetch a list of all commercial and residential property sale notices.',
        tags: ['sales-notice'],
        responses: {
          '200': { 
            description: 'The list of sales notice objects',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/sales-notice/get-by-slug/{slug}']) {
    spec.paths['/api/sales-notice/get-by-slug/{slug}'] = {
      get: {
        summary: 'Get sales notice by slug',
        description: 'Fetch a specific property sale notice using its unique slug.',
        tags: ['sales-notice'],
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'The slug of the sales notice to retrieve',
          },
        ],
        responses: {
          '200': { 
            description: 'The sales notice object',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
          '404': { description: 'Sales notice not found' },
        },
      },
    }
  }

  if (!spec.paths['/api/career-applications/submit']) {
    spec.paths['/api/career-applications/submit'] = {
      post: {
        summary: 'Submit career application',
        description: 'Post a new job application from a candidate.',
        tags: ['career-applications'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['fullName', 'email', 'countryCode', 'phone', 'resume', 'appliedJob'],
                properties: {
                  fullName: { type: 'string' },
                  email: { type: 'string' },
                  countryCode: { type: 'string' },
                  phone: { type: 'string' },
                  profileUrl: { type: 'string' },
                  resume: { type: 'string', description: 'ID of the uploaded media file' },
                  summary: { type: 'string' },
                  appliedJob: { type: 'string', description: 'ID of the Career post' },
                },
              },
            },
          },
        },
        responses: {
          '200': { 
            description: 'Application submitted successfully',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
          '400': { description: 'Validation error' },
        },
      },
    }
  }

  if (!spec.paths['/api/globals/customer-care/get']) {
    spec.paths['/api/globals/customer-care/get'] = {
      get: {
        summary: 'Get Customer Care data',
        description: 'Fetch the Customer Care global content including support details and resolution processes.',
        tags: ['customer-care'],
        responses: {
          '200': { 
            description: 'The customer care global object',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/employee-engagement/list']) {
    spec.paths['/api/employee-engagement/list'] = {
      get: {
        summary: 'Get all employee engagement programs',
        description: 'Fetch a list of all employee engagement programs like workshops, celebrations, and events.',
        tags: ['employee-engagement'],
        responses: {
          '200': { 
            description: 'The list of engagement programs',
            content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } }
          },
        },
      },
    }
  }

  if (!spec.paths['/api/employee-engagement/get-by-slug/{slug}']) {
    spec.paths['/api/employee-engagement/get-by-slug/{slug}'] = {
      get: {
        summary: 'Get employee engagement by slug',
        description: 'Fetch a specific employee engagement program using its unique slug.',
        tags: ['employee-engagement'],
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'The slug of the program to retrieve',
          },
        ],
        responses: {
          '200': { 
            description: 'The engagement program object',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
          '404': { description: 'Program not found' },
        },
      },
    }
  }

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
      'vision-and-mission',
      'history',
      'chairman-message',
      'shareholder-corner',
      'nre-corners',
      'atm-services',
      'mobile-banking',
      'positive-pay-system',
      'rtgs-neft',
      'service-charges',
      'cyber-security-awareness',
      'customer-care',
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

      const isEnquirySlug = slug === 'enquiry' || slug === 'partner-enquiry' || slug === 'enquiry-settings'

      if (isEnquirySlug && (method === 'post' || method === 'get')) {
        // Enquiries have public POST, Settings have public GET
        category = 'Client'
        operation.security = []
      } else if ((slug === 'grievance' || slug === 'career-applications') && method === 'post') {
        // Grievances and Career Applications have public POST only
        category = 'Client'
        operation.security = []
      } else if (!isEnquirySlug && slug !== 'grievance' && slug !== 'career-applications' && isClientSlug && method === 'get') {
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

  if (!spec.paths['/api/globals/customer-care']) {
    spec.paths['/api/globals/customer-care'] = {
      get: {
        summary: 'Get customer care global data',
        description: 'Fetch the site-wide customer care configuration.',
        tags: ['globals'],
        responses: {
          '200': { 
            description: 'The customer care global object',
            content: { 'application/json': { schema: { type: 'object' } } }
          },
        },
      },
    }
  }

  return spec
}
