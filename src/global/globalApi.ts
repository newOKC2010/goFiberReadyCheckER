export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN_REQUEST: '/auth/req',
    LOGIN_VERIFY: '/auth/verify',
    REGISTER: '/auth/register',
    STATUS: '/auth/status',
  },
  CHECKLIST: {
    VIEWS: '/checklist/views',
  },
  CAR: {
    VIEWS: '/car/views',
  },
  CAR_CHECKED: {
    VIEWS: '/car-checked/views',
    VIEW_IMAGE: '/car-checked/view-image',
    ADD: '/car-checked/add',
    UPDATE: '/car-checked/update',
    DELETE: '/car-checked/delete',
  },
  USER: {
    LIST: '/user/list',
  }
}