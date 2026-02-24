import { API_BASE_URL, API_ENDPOINTS } from '@/global/globalApi';
import { AuthToken } from '@/global/globalAuth';
import { CarItem, PaginationResponse } from '@/app/main/carList/utils/types';

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

export async function getCarListData(offset?: number, limit?: number): Promise<{ success: boolean; data: CarItem[]; message?: string; pagination?: PaginationResponse }> {
  const params = new URLSearchParams();
  if (offset !== undefined) params.append('offset', offset.toString());
  if (limit !== undefined) params.append('limit', limit.toString());
  
  const url = `${API_BASE_URL}${API_ENDPOINTS.CAR.VIEWS}${params.toString() ? `?${params.toString()}` : ''}`;
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

export async function addCar(licensePlateName: string): Promise<{ success: boolean; message: string; car_id?: number }> {
  const token = AuthToken.getToken();
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CAR.ADD}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ license_plate_name: licensePlateName })
  });
  return res.json();
}

export async function updateCar(carId: number, licensePlateName: string, active: boolean): Promise<{ success: boolean; message: string }> {
  const token = AuthToken.getToken();
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CAR.UPDATE}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ 
      car_id: carId,
      license_plate_name: licensePlateName,
      active
    })
  });
  return res.json();
}
