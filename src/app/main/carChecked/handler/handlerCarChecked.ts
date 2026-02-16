import { showAlert, showConfirm } from '@/global/globalSwal';
import { checkAuth, USER_ROLES } from '@/global/globalAuth';
import { getCarCheckedData, getCarList, getStaffList, deleteCarChecked } from '@/app/main/carChecked/service/serviceCarChecked';
import { CarCheckedItem, CarOption, StaffOption, FilterParams } from '@/app/main/carChecked/utils/types';

export async function loadUserRole(): Promise<string> {
  const auth = await checkAuth();
  return auth.success && auth.user ? auth.user.role : '';
}

export async function loadCars(): Promise<CarOption[]> {
  const res = await getCarList();
  return res.success ? res.data : [];
}

export async function loadStaff(): Promise<StaffOption[]> {
  const res = await getStaffList();
  return res.success ? res.data : [];
}

export async function loadData(filters: FilterParams): Promise<{ success: boolean; data: CarCheckedItem[]; message?: string }> {
  const res = await getCarCheckedData(filters);
  return { success: res.success, data: res.success ? res.data : [], message: res.message };
}

export async function handleDelete(item: CarCheckedItem, onSuccess: () => void) {
  const confirm = await showConfirm(
    `ต้องการลบข้อมูล ${item.license_plate_name} ?`,
    {},
    { confirm: '#dc2626', cancel: '#6b7280' },
    { confirm: 'ลบ', cancel: 'ยกเลิก' }
  );
  
  if (confirm) {
    const res = await deleteCarChecked(item.id);
    if (res.success) {
      showAlert('สำเร็จ', 'ลบข้อมูลสำเร็จ', 'success');
      onSuccess();
    } else {
      showAlert('ผิดพลาด', res.message, 'error');
    }
  }
}

export function createDropdownOptions(cars: CarOption[], staff: StaffOption[]) {
  return {
    carOptions: [{ value: '', label: 'ทั้งหมด' }, ...cars.map(c => ({ value: String(c.id), label: c.license_plate_name }))],
    staffOptions: [{ value: '', label: 'ทั้งหมด' }, ...staff.map(s => ({ value: s.value, label: s.label }))],
    itemsPerPageOptions: [
      { value: '5', label: '5 รายการ' },
      { value: '10', label: '10 รายการ' }
    ]
  };
}

export function paginateData<T>(data: T[], currentPage: number, itemsPerPage: number) {
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  return { paginatedData, totalPages };
}

export function isAdminOrSuperAdmin(role: string) {
  return role === USER_ROLES.ADMIN || role === USER_ROLES.SUPER_ADMIN;
}
