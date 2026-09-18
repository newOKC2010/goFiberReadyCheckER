import { API_BASE_URL, API_ENDPOINTS } from '@/global/globalApi';
import { AuthToken } from '@/global/globalAuth';
import { EmerChecklistItem, PaginationResponse } from '@/app/main/EmerChecklist/utils/types';

async function fetchWithAuth(url: string, options?: RequestInit) {
  const token = AuthToken.getToken();
  const res = await fetch(url, {
    ...options,
    headers: { ...options?.headers, Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function getEmerChecklistData(offset?: number, limit?: number): Promise<{ success: boolean; data: EmerChecklistItem[]; pagination?: PaginationResponse }> {
  const params = new URLSearchParams();
  if (offset !== undefined) params.append('offset', offset.toString());
  if (limit !== undefined) params.append('limit', limit.toString());

  const url = `${API_BASE_URL}${API_ENDPOINTS.EMERGENCY_LIST.VIEWS}${params.toString() ? `?${params.toString()}` : ''}`;
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

export async function addEmerChecklist(name: string, description?: string, itemType?: string, trueLabel?: string, falseLabel?: string): Promise<{ success: boolean; message: string }> {
  const token = AuthToken.getToken();
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EMERGENCY_LIST.ADD}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name, description, item_type: itemType, true_label: trueLabel, false_label: falseLabel })
  });
  return res.json();
}

export async function updateEmerChecklist(id: number, name: string, description: string, isActive: boolean): Promise<{ success: boolean; message: string }> {
  const token = AuthToken.getToken();
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EMERGENCY_LIST.UPDATE}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ emergency_list_id: id, name, description, is_active: isActive })
  });
  return res.json();
}
