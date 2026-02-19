import { updateCar } from '@/app/main/carList/service/serviceCarList';
import { showAlert } from '@/global/globalSwal';
import { UpdateFormData } from '@/app/main/carList/component/update/utils/types';

export async function handleUpdateSubmit(
  data: UpdateFormData,
  setLoading: (loading: boolean) => void,
  onSuccess: () => void
) {
  setLoading(true);

  const result = await updateCar(data.car_id, data.license_plate_name, data.active);

  if (result.success) {
    showAlert(result.message, 'success');
    onSuccess();
  } else {
    showAlert(result.message, 'error');
  }

  setLoading(false);
}
