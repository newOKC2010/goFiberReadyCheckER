import { ParcelCheckedItem } from '@/app/main/ParcelChecked/utils/types';

export interface DeleteFormData { parcel_checked_id: number; }

export interface DeleteFormProps {
  item: ParcelCheckedItem;
  loading: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}
