import { updateEmerList } from '@/app/main/EmerList/service/serviceEmerList';
import { showAlert } from '@/global/globalSwal';
import { UpdateEmerListFormData } from './types';

export async function handleUpdateSubmit(
  data: UpdateEmerListFormData,
  setLoading: (v: boolean) => void,
  onSuccess: () => void
) {
  setLoading(true);
  const res = await updateEmerList(data.emergency_id, data.license_plate_name, '', data.active);
  setLoading(false);

  if (res.success) {
    showAlert('สำเร็จ', 'แก้ไขข้อมูลสำเร็จ', 'success');
    onSuccess();
  } else {
    showAlert('ผิดพลาด', res.message, 'error');
  }
}
