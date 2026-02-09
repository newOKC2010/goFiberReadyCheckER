export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN_REQUEST: '/auth/req',
    LOGIN_VERIFY: '/auth/verify',
    REGISTER: '/auth/register',
    STATUS: '/auth/status',
  }
}