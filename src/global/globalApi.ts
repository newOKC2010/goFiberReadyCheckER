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
    ADD: '/checklist/add',
    UPDATE: '/checklist/update',
  },
  CAR: {
    VIEWS: '/car/views',
    ADD: '/car/add',
    UPDATE: '/car/update',
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