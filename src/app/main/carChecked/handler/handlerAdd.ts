import { API_BASE_URL, API_ENDPOINTS } from '@/global/globalApi';
import { AuthToken } from '@/global/globalAuth';
import { ChecklistOption } from '../utils/types';

export const loadChecklists = async (): Promise<ChecklistOption[]> => {
  try {
    const token = AuthToken.getToken();
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CHECKLIST.VIEWS}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    
    if (result.success) {
      return result.data || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error loading checklists:', error);
    return [];
  }
};
