import { API_BASE_URL, API_ENDPOINTS } from '@/global/globalApi';
import { AuthToken } from '@/global/globalAuth';
import { CarCheckedItem, CarOption, StaffOption, FilterParams, ChecklistOption } from '@/app/main/carChecked/utils/types';

async function fetchWithAuth(url: string) {
  const token = AuthToken.getToken();
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function getCarCheckedData(filters: FilterParams): Promise<{ success: boolean; data: CarCheckedItem[]; message?: string }> {
  const params = new URLSearchParams();
  if (filters.date_from) params.append('date_from', filters.date_from);
  if (filters.date_to) params.append('date_to', filters.date_to);
  if (filters.car_id) params.append('car_id', filters.car_id);
  if (filters.staff_id) params.append('staff_id', filters.staff_id);

  const url = `${API_BASE_URL}${API_ENDPOINTS.CAR_CHECKED.VIEWS}?${params.toString()}`;
  return fetchWithAuth(url);
}

export async function getCarList(): Promise<{ success: boolean; data: CarOption[] }> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.CAR.VIEWS}`;
  return fetchWithAuth(url);
}

export async function getStaffList(): Promise<{ success: boolean; data: StaffOption[] }> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.USER.LIST}`;
  const result = await fetchWithAuth(url);
  
  if (result.success && result.data) {
    // Map จาก { id, full_name } เป็น { value, label }
    result.data = result.data.map((staff: any) => ({
      value: staff.id.toString(),
      label: staff.full_name
    }));
  }
  
  return result;
}

export async function deleteCarChecked(carCheckedId: number): Promise<{ success: boolean; message: string }> {
  const token = AuthToken.getToken();
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CAR_CHECKED.DELETE}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ car_checked_id: carCheckedId })
  });
  return res.json();
}

export async function getCarCheckedById(id: number): Promise<{ success: boolean; data?: CarCheckedItem; message?: string }> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.CAR_CHECKED.VIEWS}?id=${id}`;
  const result = await fetchWithAuth(url);
  
  if (result.success && result.data && result.data.length > 0) {
    return { success: true, data: result.data[0] };
  }
  return { success: false, message: 'ไม่พบข้อมูล' };
}

export async function loadChecklists(): Promise<ChecklistOption[]> {
  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.CHECKLIST.VIEWS}`;
    const result = await fetchWithAuth(url);
    
    if (result.success) {
      return result.data || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error loading checklists:', error);
    return [];
  }
}
