export class PayloadClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  }

  /**
   * Helper to fetch data from a collection
   */
  async getCollection(slug: string, queryParams: Record<string, string> = {}) {
    const params = new URLSearchParams(queryParams)

    const response = await fetch(`${this.baseUrl}/api/${slug}?${params.toString()}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${slug}: ${response.statusText}`)
    }
    return response.json()
  }

  /**
   * Fetch specific item by ID
   */
  async getByID(slug: string, id: string) {
    const response = await fetch(`${this.baseUrl}/api/${slug}/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${slug} by ID: ${response.statusText}`)
    }
    return response.json()
  }

  /**
   * Fetch specific item by Slug using the collection's list endpoint with a filter
   */
  async getBySlug(slug: string, itemSlug: string) {
    const params = new URLSearchParams({
      'where[slug][equals]': itemSlug,
    })

    const response = await fetch(`${this.baseUrl}/api/${slug}?${params.toString()}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${slug} by slug: ${response.statusText}`)
    }
    const data = await response.json()

    if (!data.docs || data.docs.length === 0) {
      return null
    }

    return data.docs[0]
  }

  // Specific helpers
  getBlogs() {
    return this.getCollection('blogs')
  }

  /**
   * Fetch a single blog by its slug using the dedicated endpoint
   */
  async getBlogBySlug(slug: string) {
    const response = await fetch(`${this.baseUrl}/api/blogs/get-by-slug/${slug}`)
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`Failed to fetch blog by slug: ${response.statusText}`)
    }
    return response.json()
  }

  getTestimonials() {
    return this.getCollection('testimonials')
  }

  /**
   * Submit an Enquiry
   */
  async submitInquiry(data: {
    name: string
    email: string
    countryCode: string
    phone: string
    message: string
    date: string
  }) {
    const response = await fetch(`${this.baseUrl}/api/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Failed to submit Enquiry: ${response.statusText}`)
    }

    return response.json()
  }


  /**
   * Request a password reset email
   */
  async forgotPassword(email: string) {
    const response = await fetch(`${this.baseUrl}/api/users/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      throw new Error(`Forgot password request failed: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Reset password using a token
   */
  async resetPassword(data: { token: string; password: string }) {
    const response = await fetch(`${this.baseUrl}/api/users/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Reset password failed: ${response.statusText}`)
    }

    return response.json()
  }
}
