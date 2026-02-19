import { addChecklist } from '@/app/main/carChecklist/service/serviceChecklist';
import { showAlert } from '@/global/globalSwal';
import { AddFormData } from '@/app/main/carChecklist/component/add/utils/types';

export async function handleAddSubmit(
  data: AddFormData,
  onSuccess: () => void,
  setLoading: (loading: boolean) => void
) {
  setLoading(true);
  
  const res = await addChecklist(data.name);
  
  setLoading(false);
  
  if (res.success) {
    showAlert('สำเร็จ', 'เพิ่มข้อมูลสำเร็จ', 'success');
    onSuccess();
  } else {
    showAlert('ผิดพลาด', res.message, 'error');
  }
}
