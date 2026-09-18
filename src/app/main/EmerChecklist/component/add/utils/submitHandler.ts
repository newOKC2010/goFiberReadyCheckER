import { addEmerChecklist } from '@/app/main/EmerChecklist/service/serviceEmerChecklist';
import { showAlert } from '@/global/globalSwal';
import { AddEmerChecklistFormData } from '@/app/main/EmerChecklist/component/add/utils/types';

export async function handleAddSubmit(
  data: AddEmerChecklistFormData,
  setLoading: (v: boolean) => void,
  onSuccess: () => void
) {
  setLoading(true);
  const res = await addEmerChecklist(data.name, undefined, data.item_type, data.true_label, data.false_label);
  setLoading(false);

  if (res.success) {
    showAlert('สำเร็จ', 'เพิ่มรายการตรวจสอบสำเร็จ', 'success');
    onSuccess();
  } else {
    showAlert('ผิดพลาด', res.message, 'error');
  }
}
