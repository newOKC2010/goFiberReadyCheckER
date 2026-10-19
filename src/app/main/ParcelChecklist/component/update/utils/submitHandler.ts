import { updateParcelChecklist } from '@/app/main/ParcelChecklist/service/serviceParcelChecklist';
import { showAlert } from '@/global/globalSwal';
import { UpdateParcelChecklistFormData } from './types';

export async function handleUpdateSubmit(
  data: UpdateParcelChecklistFormData,
  setLoading: (v: boolean) => void,
  onSuccess: () => void
) {
  setLoading(true);
  const res = await updateParcelChecklist(data.parcel_list_id, data.name, '', data.is_active, data.true_label, data.false_label);
  setLoading(false);

  if (res.success) {
    showAlert('สำเร็จ', 'แก้ไขข้อมูลสำเร็จ', 'success');
    onSuccess();
  } else {
    showAlert('ผิดพลาด', res.message, 'error');
  }
}
