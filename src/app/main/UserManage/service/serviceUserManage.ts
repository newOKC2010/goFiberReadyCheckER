import { API_BASE_URL, API_ENDPOINTS } from '@/global/globalApi';
import { AuthToken } from '@/global/globalAuth';
import { UserItem, PaginationResponse } from '@/app/main/UserManage/utils/types';

async function fetchWithAuth(url: string, options?: RequestInit) {
  const token = AuthToken.getToken();
  const res = await fetch(url, {
    ...options,
    headers: { ...options?.headers, Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export interface UserFilter {
  search?: string;
  role?: string;
  status?: string;
}

export async function getUserList(offset?: number, limit?: number, filter?: UserFilter): Promise<{ success: boolean; data: UserItem[]; message?: string; pagination?: PaginationResponse }> {
  const params = new URLSearchParams();
  if (offset !== undefined) params.append('offset', offset.toString());
  if (limit !== undefined) params.append('limit', limit.toString());
  if (filter?.search) params.append('search', filter.search);
  if (filter?.role) params.append('role', filter.role);
  if (filter?.status !== undefined && filter.status !== '') params.append('status', filter.status);
  const url = `${API_BASE_URL}${API_ENDPOINTS.USER.LIST}${params.toString() ? `?${params.toString()}` : ''}`;
  const result = await fetchWithAuth(url);
  if (result.success && result.total_count !== undefined) {
    return {
      ...result,
      pagination: {
        total_count: result.total_count,
        total_pages: result.total_pages,
        current_page: result.current_page
      }
    };
  }
  return result;
}

export async function updateUserStatus(
  userId: number,
  status: boolean,
  role?: string
): Promise<{ success: boolean; message: string }> {
  const token = AuthToken.getToken();
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER.UPDATE_STATUS}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ user_id: userId, status, role: role ?? '' })
  });
  return res.json();
}
