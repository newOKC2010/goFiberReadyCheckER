import { API_BASE_URL, API_ENDPOINTS } from '@/global/globalApi';
import { AuthToken } from '@/global/globalAuth';
import { EmerCheckedItem, EmerOption, StaffOption, FilterParams, PaginationResponse } from '@/app/main/EmerChecked/utils/types';

async function fetchWithAuth(url: string) {
  const token = AuthToken.getToken();
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  return res.json();
}

export async function getEmerCheckedData(filters: FilterParams): Promise<{ success: boolean; data: EmerCheckedItem[]; message?: string; pagination?: PaginationResponse }> {
  const params = new URLSearchParams();
  if (filters.date_from) params.append('date_from', filters.date_from);
  if (filters.date_to) params.append('date_to', filters.date_to);
  if (filters.emergency_id) params.append('emergency_id', filters.emergency_id);
  if (filters.staff_id) params.append('staff_id', filters.staff_id);
  if (filters.offset !== undefined) params.append('offset', filters.offset.toString());
  if (filters.limit !== undefined) params.append('limit', filters.limit.toString());

  const result = await fetchWithAuth(`${API_BASE_URL}${API_ENDPOINTS.EMERGENCY_CHECKED.VIEWS}?${params.toString()}`);

  if (result.success && result.total_count !== undefined) {
    return { ...result, pagination: { total_count: result.total_count, total_pages: result.total_pages, current_page: result.current_page } };
  }
  return result;
}

export async function getEmerList(): Promise<{ success: boolean; data: EmerOption[] }> {
  return fetchWithAuth(`${API_BASE_URL}${API_ENDPOINTS.EMERGENCY.VIEWS}`);
}

export async function getStaffList(): Promise<{ success: boolean; data: StaffOption[] }> {
  const result = await fetchWithAuth(`${API_BASE_URL}${API_ENDPOINTS.USER.LIST}`);
  if (result.success && result.data) {
    result.data = result.data.map((s: any) => ({ value: s.id.toString(), label: s.full_name }));
  }
  return result;
}

export async function deleteEmerChecked(id: number): Promise<{ success: boolean; message: string }> {
  const token = AuthToken.getToken();
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EMERGENCY_CHECKED.DELETE}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ emergency_checked_id: id })
  });
  return res.json();
}

export async function getEmerCheckedById(id: number): Promise<{ success: boolean; data?: EmerCheckedItem; message?: string }> {
  const result = await fetchWithAuth(`${API_BASE_URL}${API_ENDPOINTS.EMERGENCY_CHECKED.VIEWS}?id=${id}`);
  if (result.success && result.data?.length > 0) return { success: true, data: result.data[0] };
  return { success: false, message: 'ไม่พบข้อมูล' };
}
