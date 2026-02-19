import { CarItem } from '@/app/main/carList/utils/types';

export interface UpdateFormData {
  car_id: number;
  license_plate_name: string;
  active: boolean;
}

export interface UpdateFormProps {
  item: CarItem;
  loading: boolean;
  onSubmit: (data: UpdateFormData) => void;
  onCancel: () => void;
}
