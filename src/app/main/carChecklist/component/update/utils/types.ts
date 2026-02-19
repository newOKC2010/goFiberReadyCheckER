import { ChecklistItem } from '@/app/main/carChecklist/utils/types';

export interface UpdateFormData {
  checklist_id: number;
  name: string;
  is_active: boolean;
}

export interface UpdateFormProps {
  item: ChecklistItem;
  loading: boolean;
  onSubmit: (data: UpdateFormData) => void;
  onCancel: () => void;
}
