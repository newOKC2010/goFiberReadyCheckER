import { ParcelOption } from '@/app/main/ParcelChecked/utils/types';
import { ParcelChecklistItem } from '@/app/main/ParcelChecklist/utils/types';

export interface ChecklistFormItem {
  checklist_id: string;
  name: string;
  item_type: string;       // 'boolean' | 'plain_text'
  true_label: string;
  false_label: string;
  status: boolean | null;  // null = ยังไม่ได้เลือก (สำหรับ boolean)
  note: string;            // ใช้เป็น plain text value สำหรับ plain_text type
  images: File[];
}

export interface AddFormProps {
  emergencies: ParcelOption[];
  checklists: ParcelChecklistItem[];
  loading: boolean;
  setLoading: (v: boolean) => void;
  onSuccess: () => void;
  onCancel: () => void;
}
