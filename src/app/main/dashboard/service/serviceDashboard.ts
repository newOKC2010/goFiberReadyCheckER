import { API_BASE_URL, API_ENDPOINTS } from '@/global/globalApi';
import { AuthToken } from '@/global/globalAuth';
import { DashboardData } from '@/app/main/dashboard/utils/types';

export async function getDashboardData(): Promise<DashboardData> {
  const token = AuthToken.getToken();
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.DASHBOARD.VIEWS}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
