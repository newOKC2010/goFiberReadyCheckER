import { deleteCarChecked } from '@/app/main/carChecked/service/serviceCarChecked';
import { showAlert } from '@/global/globalSwal';
import { DeleteFormData } from '@/app/main/carChecked/component/delete/utils/types';

export async function handleDeleteSubmit(
  data: DeleteFormData,
  onSuccess: () => void,
  setLoading: (loading: boolean) => void
) {
  setLoading(true);
  
  const res = await deleteCarChecked(data.car_checked_id);
  
  setLoading(false);
  
  if (res.success) {
    showAlert('สำเร็จ', 'ลบข้อมูลสำเร็จ', 'success');
    onSuccess();
  } else {
    showAlert('ผิดพลาด', res.message, 'error');
  }
}
