import { FilterParams } from '@/app/main/EmerChecked/utils/types';

export function validateDateFilters(filters: FilterParams): { valid: boolean; message?: string } {
  const hasStart = filters.date_from?.trim() !== '';
  const hasEnd = filters.date_to?.trim() !== '';

  if (!hasStart && !hasEnd) return { valid: false, message: 'กรุณาเลือกช่วงวันที่สำหรับค้นหา' };
  if (hasStart && !hasEnd) return { valid: false, message: 'กรุณาเลือกวันที่สิ้นสุดด้วย' };
  if (!hasStart && hasEnd) return { valid: false, message: 'กรุณาเลือกวันที่เริ่มต้นด้วย' };
  return { valid: true };
}
