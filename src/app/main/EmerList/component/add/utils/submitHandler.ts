import { addEmerList } from '@/app/main/EmerList/service/serviceEmerList';
import { showAlert } from '@/global/globalSwal';
import { AddEmerListFormData } from '@/app/main/EmerList/component/add/utils/types';

export async function handleAddSubmit(
  data: AddEmerListFormData,
  setLoading: (v: boolean) => void,
  onSuccess: () => void
) {
  setLoading(true);
  const res = await addEmerList(data.license_plate_name);
  setLoading(false);

  if (res.success) {
    showAlert('สำเร็จ', 'เพิ่มทะเบียนรถสำเร็จ', 'success');
    onSuccess();
  } else {
    showAlert('ผิดพลาด', res.message, 'error');
  }
}
