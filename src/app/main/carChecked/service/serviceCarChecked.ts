import { API_BASE_URL, API_ENDPOINTS } from '@/global/globalApi';
import { AuthToken } from '@/global/globalAuth';
import { CarCheckedItem, CarOption, StaffOption, FilterParams } from '@/app/main/carChecked/utils/types';

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
  return fetchWithAuth(url);
}

export async function deleteCarChecked(id: number): Promise<{ success: boolean; message: string }> {
  const token = AuthToken.getToken();
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CAR_CHECKED.DELETE}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ id })
  });
  return res.json();
}
