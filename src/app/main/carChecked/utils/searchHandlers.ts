import { showAlert } from '@/global/globalSwal';
import * as handler from '@/app/main/carChecked/handler/handlerCarChecked';
import { FilterParams, CarCheckedItem, PaginationResponse } from '@/app/main/carChecked/utils/types';
import { validateDateFilters } from '@/app/main/carChecked/utils/validation';

export async function handleSearch(
  filters: FilterParams,
  setSearchLoading: (loading: boolean) => void,
  setData: (data: CarCheckedItem[]) => void,
  setPagination: (pagination: PaginationResponse) => void,
  setCurrentPage: (page: number) => void
) {
  // Validate วันที่
  const validation = validateDateFilters(filters);
  if (!validation.valid) {
    showAlert('ข้อผิดพลาด', validation.message!, 'error');
    return;
  }

  setSearchLoading(true);
  const result = await handler.loadData(filters);
  
  if (result.success) {
    setData(result.data);
    if (result.pagination) setPagination(result.pagination);
    setCurrentPage(1);
  } else {
    setData([]);
  }
  
  setTimeout(() => {
    setSearchLoading(false);
    if (result.success) {
      if (result.data.length === 0) {
        showAlert('แจ้งเตือน', 'ไม่พบข้อมูล', 'info');
      } else {
        showAlert('สำเร็จ', `พบข้อมูล ${result.data.length} รายการ`, 'success');
      }
    } else {
      showAlert('ผิดพลาด', result.message || 'ไม่สามารถค้นหาข้อมูลได้', 'error');
    }
  }, 3000);
}

export async function handleReset(
  setFilters: (filters: FilterParams) => void,
  setSearchLoading: (loading: boolean) => void,
  setData: (data: CarCheckedItem[]) => void,
  setPagination: (pagination: PaginationResponse) => void,
  setCurrentPage: (page: number) => void
) {
  setSearchLoading(true);
  setFilters({});
  setCurrentPage(1);
  const result = await handler.loadData({ offset: 0, limit: 5 });
  
  if (result.success) {
    setData(result.data);
    if (result.pagination) setPagination(result.pagination);
  } else {
    setData([]);
  }
  
  setTimeout(() => {
    setSearchLoading(false);
    if (result.success) {
      if (result.data.length === 0) {
        showAlert('แจ้งเตือน', 'รีเซ็ตเสร็จ แต่ไม่พบข้อมูล', 'info');
      } else {
        showAlert('สำเร็จ', `รีเซ็ตเสร็จ พบข้อมูล ${result.pagination?.total_count || result.data.length} รายการ`, 'success');
      }
    } else {
      showAlert('ผิดพลาด', result.message || 'ไม่สามารถรีเซ็ตข้อมูลได้', 'error');
    }
  }, 3000);
}
