import { EmerCheckedItem } from '@/app/main/EmerChecked/utils/types';

export interface DeleteFormData { emergency_checked_id: number; }

export interface DeleteFormProps {
  item: EmerCheckedItem;
  loading: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}
