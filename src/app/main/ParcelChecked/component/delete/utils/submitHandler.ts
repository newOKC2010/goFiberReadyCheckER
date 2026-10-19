import { deleteParcelChecked } from '@/app/main/ParcelChecked/service/serviceParcelChecked';
import { showAlert } from '@/global/globalSwal';
import { DeleteFormData } from '@/app/main/ParcelChecked/component/delete/utils/types';

export async function handleDeleteSubmit(data: DeleteFormData, onSuccess: () => void, setLoading: (v: boolean) => void) {
  setLoading(true);
  const res = await deleteParcelChecked(data.parcel_checked_id);
  setLoading(false);
  if (res.success) { showAlert('สำเร็จ', 'ลบข้อมูลสำเร็จ', 'success'); onSuccess(); }
  else showAlert('ผิดพลาด', res.message, 'error');
}
