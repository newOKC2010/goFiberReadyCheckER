export interface UpdateFormProps {
  carCheckedId: number;
  checklistItem: ChecklistItemData;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  onSuccess: () => void;
  onCancel: () => void;
}

export interface ChecklistItemData {
  checklist_id: string;
  name: string;
  note: string;
  status: boolean;
  images: string[]; // Array of image paths from backend
}

export interface UpdateImageManagerProps {
  checklistId: string;
  existingImages: string[]; // Paths from backend
  newImages: File[];
  onExistingImagesChange: (images: string[]) => void;
  onNewImagesChange: (images: File[]) => void;
}

export interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  carCheckedId: number;
  checklistItem: ChecklistItemData;
}
