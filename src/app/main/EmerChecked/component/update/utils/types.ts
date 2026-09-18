export interface UpdateFormProps {
  emerCheckedId: number;
  checklistItem: ChecklistItemData;
  loading: boolean;
  setLoading: (v: boolean) => void;
  onSuccess: () => void;
  onCancel: () => void;
}

export interface ChecklistItemData {
  checklist_id: string;
  name: string;
  note: string;
  status: boolean;
  images: string[];
  item_type: string;
}

export interface UpdateImageManagerProps {
  checklistId: string;
  existingImages: string[];
  newImages: File[];
  onExistingImagesChange: (images: string[]) => void;
  onNewImagesChange: (images: File[]) => void;
}

export interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  emerCheckedId: number;
  checklistItem: ChecklistItemData;
}
