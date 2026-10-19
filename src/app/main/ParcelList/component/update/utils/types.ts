import { ParcelListItem } from '@/app/main/ParcelList/utils/types';

export interface UpdateParcelListFormData {
  parcel_id: number;
  name: string;
  active: boolean;
}

export interface UpdateFormProps {
  item: ParcelListItem;
  loading: boolean;
  onSubmit: (data: UpdateParcelListFormData) => void;
  onCancel: () => void;
}
