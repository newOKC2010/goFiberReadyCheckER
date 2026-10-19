import { addParcelListItem } from '@/app/main/ParcelList/service/serviceParcelList';
import { showAlert } from '@/global/globalSwal';
import { AddParcelListFormData } from './types';

export async function handleAddSubmit(data: AddParcelListFormData, setLoading: (v: boolean) => void, onSuccess: () => void) {
  setLoading(true);
  const res = await addParcelListItem(data.name);
  setLoading(false);
  if (res.success) { showAlert('สำเร็จ', 'เพิ่มพัสดุสำเร็จ', 'success'); onSuccess(); }
  else { showAlert('ผิดพลาด', res.message, 'error'); }
}
