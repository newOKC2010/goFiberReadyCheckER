import { EmerChecklistItem } from '@/app/main/EmerChecklist/utils/types';

export interface UpdateEmerChecklistFormData {
  emergency_list_id: number;
  name: string;
  is_active: boolean;
}

export interface UpdateFormProps {
  item: EmerChecklistItem;
  loading: boolean;
  onSubmit: (data: UpdateEmerChecklistFormData) => void;
  onCancel: () => void;
}
