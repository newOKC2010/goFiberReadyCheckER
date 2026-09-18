import { deleteEmerChecked } from '@/app/main/EmerChecked/service/serviceEmerChecked';
import { showAlert } from '@/global/globalSwal';
import { DeleteFormData } from '@/app/main/EmerChecked/component/delete/utils/types';

export async function handleDeleteSubmit(data: DeleteFormData, onSuccess: () => void, setLoading: (v: boolean) => void) {
  setLoading(true);
  const res = await deleteEmerChecked(data.emergency_checked_id);
  setLoading(false);
  if (res.success) { showAlert('สำเร็จ', 'ลบข้อมูลสำเร็จ', 'success'); onSuccess(); }
  else showAlert('ผิดพลาด', res.message, 'error');
}
