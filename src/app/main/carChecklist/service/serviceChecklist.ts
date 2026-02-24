import { API_BASE_URL, API_ENDPOINTS } from '@/global/globalApi';
import { AuthToken } from '@/global/globalAuth';
import { ChecklistItem, PaginationResponse } from '@/app/main/carChecklist/utils/types';

async function fetchWithAuth(url: string, options?: RequestInit) {
  const token = AuthToken.getToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
}

export async function getChecklistData(offset?: number, limit?: number): Promise<{ success: boolean; data: ChecklistItem[]; message?: string; pagination?: PaginationResponse }> {
  const params = new URLSearchParams();
  if (offset !== undefined) params.append('offset', offset.toString());
  if (limit !== undefined) params.append('limit', limit.toString());
  
  const url = `${API_BASE_URL}${API_ENDPOINTS.CHECKLIST.VIEWS}${params.toString() ? `?${params.toString()}` : ''}`;
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

export async function addChecklist(name: string): Promise<{ success: boolean; message: string; checklist_id?: number }> {
  const token = AuthToken.getToken();
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CHECKLIST.ADD}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name })
  });
  return res.json();
}

export async function updateChecklist(checklistId: number, name: string, isActive: boolean): Promise<{ success: boolean; message: string }> {
  const token = AuthToken.getToken();
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CHECKLIST.UPDATE}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ 
      checklist_id: checklistId,
      name,
      is_active: isActive
    })
  });
  return res.json();
}
