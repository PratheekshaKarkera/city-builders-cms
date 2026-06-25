import type { PayloadRequest } from 'payload'

type ServerLogLevel = 'info' | 'warn' | 'error'

type ServerLogInput = {
  level?: ServerLogLevel
  event: string
  message: string
  req?: PayloadRequest
  details?: Record<string, unknown>
}

const getRequestPath = (req?: PayloadRequest) => {
  if (!req?.url) {
    return undefined
  }

  try {
    return new URL(req.url).pathname
  } catch {
    return req.url
  }
}

export async function writeServerLog({
  level = 'info',
  event,
  message,
  req,
  details,
}: ServerLogInput) {
  const log = {
    level,
    event,
    message,
    method: req?.method,
    path: getRequestPath(req),
    requestId: req?.headers.get('x-request-id') || req?.headers.get('x-nginx-request-id'),
    details,
  }

  req?.payload?.logger[level](log, message)

  try {
    await req?.payload?.db.create({
      collection: 'server-logs',
      data: log,
      req: {
        context: {
          skipServerLog: true,
        },
        payload: req.payload,
      },
    })
  } catch (error) {
    req?.payload?.logger.error({ error, originalLog: log }, 'Failed to write server log')
  }
}
