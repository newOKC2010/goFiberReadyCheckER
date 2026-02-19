import { API_BASE_URL, API_ENDPOINTS } from '@/global/globalApi';
import { AuthToken } from '@/global/globalAuth';
import { ChecklistItem } from '@/app/main/carChecklist/utils/types';

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

export async function getChecklistData(): Promise<{ success: boolean; data: ChecklistItem[]; message?: string }> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.CHECKLIST.VIEWS}`;
  return fetchWithAuth(url);
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
