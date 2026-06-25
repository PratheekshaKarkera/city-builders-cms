import type { Access, FieldAccess } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => {
  return Boolean(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN')
}

export const isFieldAdmin: FieldAccess = ({ req: { user } }) => {
  return Boolean(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN')
}

export const isSuperAdmin: Access = ({ req: { user } }) => {
  return Boolean(user?.role === 'SUPERADMIN')
}

export const contentAccess: Access = ({ req: { user } }) => {
  // If user is Admin or Super Admin, they can access everything
  if (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') {
    return true
  }

  // Allow public read access (unauthenticated)
  return true
}
