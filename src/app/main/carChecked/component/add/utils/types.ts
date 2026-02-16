export interface ChecklistItem {
  checklist_id: string;
  name: string;
  note: string;
  status: boolean | null;
  images: File[];
}

export interface AddFormProps {
  cars: import('@/app/main/carChecked/utils/types').CarOption[];
  checklists: import('@/app/main/carChecked/utils/types').ChecklistOption[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  onSuccess: () => void;
  onCancel: () => void;
}
