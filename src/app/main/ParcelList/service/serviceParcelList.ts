import { API_BASE_URL, API_ENDPOINTS } from '@/global/globalApi';
import { AuthToken } from '@/global/globalAuth';
import { ParcelListItem, PaginationResponse } from '@/app/main/ParcelList/utils/types';

async function fetchWithAuth(url: string, options?: RequestInit) {
  const token = AuthToken.getToken();
  const res = await fetch(url, {
    ...options,
    headers: { ...options?.headers, Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function getParcelListData(offset?: number, limit?: number): Promise<{ success: boolean; data: ParcelListItem[]; pagination?: PaginationResponse }> {
  const params = new URLSearchParams();
  if (offset !== undefined) params.append('offset', offset.toString());
  if (limit !== undefined) params.append('limit', limit.toString());
  const result = await fetchWithAuth(`${API_BASE_URL}${API_ENDPOINTS.PARCEL.VIEWS}?${params.toString()}`);
  if (result.success && result.total_count !== undefined) {
    return { ...result, pagination: { total_count: result.total_count, total_pages: result.total_pages, current_page: result.current_page } };
  }
  return result;
}

export async function addParcelListItem(name: string): Promise<{ success: boolean; message: string }> {
  return fetchWithAuth(`${API_BASE_URL}${API_ENDPOINTS.PARCEL.ADD}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
}

export async function updateParcelListItem(id: number, name: string, active: boolean): Promise<{ success: boolean; message: string }> {
  return fetchWithAuth(`${API_BASE_URL}${API_ENDPOINTS.PARCEL.UPDATE}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ parcel_id: id, name, active })
  });
}
