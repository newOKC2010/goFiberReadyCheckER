import { FilterParams } from '@/app/main/carChecked/utils/types';

export function validateDateFilters(filters: FilterParams): { valid: boolean; message?: string } {
  const hasStartDate = filters.date_from && filters.date_from.trim() !== '';
  const hasEndDate = filters.date_to && filters.date_to.trim() !== '';
  
  // บังคับให้เลือกวันที่ทั้งคู่
  if (!hasStartDate && !hasEndDate) {
    return { valid: false, message: 'กรุณาเลือกช่วงวันที่สำหรับค้นหา' };
  }
  
  if (hasStartDate && !hasEndDate) {
    return { valid: false, message: 'กรุณาเลือกวันที่สิ้นสุดด้วย' };
  }
  
  if (!hasStartDate && hasEndDate) {
    return { valid: false, message: 'กรุณาเลือกวันที่เริ่มต้นด้วย' };
  }

  return { valid: true };
}
