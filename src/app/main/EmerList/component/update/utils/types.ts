import { EmerListItem } from '@/app/main/EmerList/utils/types';

export interface UpdateEmerListFormData {
  emergency_id: number;
  license_plate_name: string;
  active: boolean;
}

export interface UpdateFormProps {
  item: EmerListItem;
  loading: boolean;
  onSubmit: (data: UpdateEmerListFormData) => void;
  onCancel: () => void;
}
