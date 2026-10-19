import { addParcelChecklist } from '@/app/main/ParcelChecklist/service/serviceParcelChecklist';
import { showAlert } from '@/global/globalSwal';
import { AddParcelChecklistFormData } from '@/app/main/ParcelChecklist/component/add/utils/types';

export async function handleAddSubmit(
  data: AddParcelChecklistFormData,
  setLoading: (v: boolean) => void,
  onSuccess: () => void
) {
  setLoading(true);
  const res = await addParcelChecklist(data.name, undefined, data.item_type, data.true_label, data.false_label);
  setLoading(false);

  if (res.success) {
    showAlert('สำเร็จ', 'เพิ่มรายการตรวจสอบสำเร็จ', 'success');
    onSuccess();
  } else {
    showAlert('ผิดพลาด', res.message, 'error');
  }
}
