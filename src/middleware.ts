import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory rate limiting map
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS = 500

function logApiEvent(
  level: 'info' | 'warn',
  event: string,
  request: NextRequest,
  details: Record<string, unknown> = {},
) {
  const log = {
    event,
    method: request.method,
    path: request.nextUrl.pathname,
    requestId: request.headers.get('x-request-id') || request.headers.get('x-vercel-id'),
    ...details,
  }

  console[level](JSON.stringify(log))
}

export function middleware(request: NextRequest) {
  const startedAt = Date.now()
  // Get IP from headers (x-forwarded-for is the standard)
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1'
  
  const now = Date.now()
  
  // Rate Limiting Logic
  const rateData = rateLimitMap.get(ip) || { count: 0, lastReset: now }
  
  if (now - rateData.lastReset > WINDOW_MS) {
    rateData.count = 0
    rateData.lastReset = now
  }
  
  rateData.count++
  rateLimitMap.set(ip, rateData)
  
  if (rateData.count > MAX_REQUESTS) {
    logApiEvent('warn', 'api.rate_limited', request, {
      ip,
      limit: MAX_REQUESTS,
      windowMs: WINDOW_MS,
      requestCount: rateData.count,
      durationMs: Date.now() - startedAt,
      status: 429,
    })
    return new NextResponse('Rate limit exceeded', { status: 429 })
  }

  const { searchParams } = request.nextUrl
  const keys = Array.from(searchParams.keys())
  
  // HPP Protection: Detect duplicate query parameters
  const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index)
  
  if (duplicates.length > 0) {
    // For security, if duplicates are found, we can either:
    // 1. Block the request (stricter)
    // 2. Rewrite the URL to only include the last occurrence of each key (cleaner)
    
    const newSearchParams = new URLSearchParams()
    searchParams.forEach((value, key) => {
      // URLSearchParams.forEach iterates in order. 
      // Overwriting will ensure we keep the last value, which is a common HPP mitigation.
      newSearchParams.set(key, value)
    })
    
    const url = request.nextUrl.clone()
    url.search = newSearchParams.toString()

    logApiEvent('warn', 'api.duplicate_query_params_rewritten', request, {
      duplicateParams: [...new Set(duplicates)],
      durationMs: Date.now() - startedAt,
      status: 200,
    })
    
    return NextResponse.rewrite(url)
  }

  logApiEvent('info', 'api.request', request, {
    durationMs: Date.now() - startedAt,
    status: 200,
  })

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*',
}
