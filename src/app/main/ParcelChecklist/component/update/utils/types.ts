import { ParcelChecklistItem } from '@/app/main/ParcelChecklist/utils/types';

export interface UpdateParcelChecklistFormData {
  parcel_list_id: number;
  name: string;
  is_active: boolean;
  true_label?: string;
  false_label?: string;
}

export interface UpdateFormProps {
  item: ParcelChecklistItem;
  loading: boolean;
  onSubmit: (data: UpdateParcelChecklistFormData) => void;
  onCancel: () => void;
}
