import { updateEmerChecklist } from '@/app/main/EmerChecklist/service/serviceEmerChecklist';
import { showAlert } from '@/global/globalSwal';
import { UpdateEmerChecklistFormData } from './types';

export async function handleUpdateSubmit(
  data: UpdateEmerChecklistFormData,
  setLoading: (v: boolean) => void,
  onSuccess: () => void
) {
  setLoading(true);
  const res = await updateEmerChecklist(data.emergency_list_id, data.name, '', data.is_active, data.true_label, data.false_label);
  setLoading(false);

  if (res.success) {
    showAlert('สำเร็จ', 'แก้ไขข้อมูลสำเร็จ', 'success');
    onSuccess();
  } else {
    showAlert('ผิดพลาด', res.message, 'error');
  }
}
