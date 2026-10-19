import { updateParcelListItem } from '@/app/main/ParcelList/service/serviceParcelList';
import { showAlert } from '@/global/globalSwal';
import { UpdateParcelListFormData } from './types';

export async function handleUpdateSubmit(data: UpdateParcelListFormData, setLoading: (v: boolean) => void, onSuccess: () => void) {
  setLoading(true);
  const res = await updateParcelListItem(data.parcel_id, data.name, data.active);
  setLoading(false);
  if (res.success) { showAlert('สำเร็จ', 'แก้ไขข้อมูลสำเร็จ', 'success'); onSuccess(); }
  else { showAlert('ผิดพลาด', res.message, 'error'); }
}
