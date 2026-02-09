import { API_BASE_URL, API_ENDPOINTS } from './globalApi';

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
} as const;

export interface UserStaffInfo {
  user_staff_id: number;
  email: string;
  role: string;
  department_name?: string;
}

export class AuthToken {
  private static key = 'auth_token';
  private static maxAge = 86400; // 1 วัน
  
  static storeToken = (token: string) => {
    document.cookie = `${this.key}=${token}; path=/; max-age=${this.maxAge}`;
  };
  
  static getToken = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith(`${this.key}=`))
      ?.split('=')[1];
  };
  
  static removeToken = () => {
    document.cookie = `${this.key}=; path=/; max-age=0`;
  };
}

export async function checkAuth(): Promise<{ success: boolean; user?: UserStaffInfo; message?: string }> {
  const token = AuthToken.getToken();
  if (!token) {
    return { success: false, message: 'ไม่พบ token' };
  }

  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.STATUS}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      AuthToken.removeToken();
      const data = await res.json();
      return { success: false, message: data.message || 'ไม่ได้รับอนุญาต' };
    }

    const data = await res.json();
    return { success: true, user: data.user };
  } catch {
    return { success: false, message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์' };
  }
}