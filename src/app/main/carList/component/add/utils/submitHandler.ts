import { addCar } from '@/app/main/carList/service/serviceCarList';
import { showAlert } from '@/global/globalSwal';
import { AddFormData } from '@/app/main/carList/component/add/utils/types';

export async function handleAddSubmit(
  data: AddFormData,
  setLoading: (loading: boolean) => void,
  onSuccess: () => void
) {
  setLoading(true);

  const result = await addCar(data.license_plate_name);

  if (result.success) {
    showAlert(result.message, 'success');
    onSuccess();
  } else {
    showAlert(result.message, 'error');
  }

  setLoading(false);
}
