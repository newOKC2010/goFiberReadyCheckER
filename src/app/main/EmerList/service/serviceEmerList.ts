import { API_BASE_URL, API_ENDPOINTS } from '@/global/globalApi';
import { AuthToken } from '@/global/globalAuth';
import { EmerListItem, PaginationResponse } from '@/app/main/EmerList/utils/types';

async function fetchWithAuth(url: string, options?: RequestInit) {
  const token = AuthToken.getToken();
  const res = await fetch(url, {
    ...options,
    headers: { ...options?.headers, Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function getEmerListData(offset?: number, limit?: number): Promise<{ success: boolean; data: EmerListItem[]; pagination?: PaginationResponse }> {
  const params = new URLSearchParams();
  if (offset !== undefined) params.append('offset', offset.toString());
  if (limit !== undefined) params.append('limit', limit.toString());

  const url = `${API_BASE_URL}${API_ENDPOINTS.EMERGENCY.VIEWS}${params.toString() ? `?${params.toString()}` : ''}`;
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

export async function addEmerList(licensePlateName: string, type?: string): Promise<{ success: boolean; message: string }> {
  const token = AuthToken.getToken();
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EMERGENCY.ADD}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ license_plate_name: licensePlateName, type })
  });
  return res.json();
}

export async function updateEmerList(id: number, licensePlateName: string, type: string, active: boolean): Promise<{ success: boolean; message: string }> {
  const token = AuthToken.getToken();
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EMERGENCY.UPDATE}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ emergency_id: id, license_plate_name: licensePlateName, type, active })
  });
  return res.json();
}
