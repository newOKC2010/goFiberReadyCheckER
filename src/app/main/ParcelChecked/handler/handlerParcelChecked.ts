import { checkAuth, USER_ROLES } from '@/global/globalAuth';
import { getParcelCheckedData, getParcelList, getStaffList } from '@/app/main/ParcelChecked/service/serviceParcelChecked';
import { ParcelCheckedItem, ParcelOption, StaffOption, FilterParams, PaginationResponse } from '@/app/main/ParcelChecked/utils/types';

export async function loadUserRole(): Promise<string> {
  const auth = await checkAuth();
  return auth.success && auth.user ? auth.user.role : '';
}

export async function loadEmergencies(): Promise<ParcelOption[]> {
  const res = await getParcelList();
  return res.success ? res.data : [];
}

export async function loadStaff(): Promise<StaffOption[]> {
  const res = await getStaffList();
  return res.success ? res.data : [];
}

export async function loadData(filters: FilterParams): Promise<{ success: boolean; data: ParcelCheckedItem[]; message?: string; pagination?: PaginationResponse }> {
  return getParcelCheckedData(filters);
}

export function createDropdownOptions(emergencies: ParcelOption[], staff: StaffOption[]) {
  return {
    emerOptions: [{ value: '', label: 'ทั้งหมด' }, ...emergencies.map(e => ({ value: String(e.id), label: e.name }))],
    staffOptions: [{ value: '', label: 'ทั้งหมด' }, ...staff.map(s => ({ value: s.value, label: s.label }))],
    itemsPerPageOptions: [{ value: '5', label: '5 รายการ' }, { value: '10', label: '10 รายการ' }]
  };
}

export function isAdminOrSuperAdmin(role: string) {
  return role === USER_ROLES.ADMIN || role === USER_ROLES.SUPER_ADMIN;
}
