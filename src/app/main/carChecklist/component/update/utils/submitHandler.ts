import { updateChecklist } from '@/app/main/carChecklist/service/serviceChecklist';
import { showAlert } from '@/global/globalSwal';
import { UpdateFormData } from './types';

export async function handleUpdateSubmit(
  data: UpdateFormData,
  onSuccess: () => void,
  setLoading: (loading: boolean) => void
) {
  setLoading(true);
  
  const res = await updateChecklist(data.checklist_id, data.name, data.is_active);
  
  setLoading(false);
  
  if (res.success) {
    showAlert('สำเร็จ', 'แก้ไขข้อมูลสำเร็จ', 'success');
    onSuccess();
  } else {
    showAlert('ผิดพลาด', res.message, 'error');
  }
}
