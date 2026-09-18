import { API_BASE_URL, API_ENDPOINTS } from '@/global/globalApi';
import { AuthToken } from '@/global/globalAuth';
import { ChecklistFormItem } from '@/app/main/EmerChecked/component/add/utils/types';
import { EmerChecklistItem } from '@/app/main/EmerChecklist/utils/types';

export const initializeChecklistItems = (checklists: EmerChecklistItem[]): ChecklistFormItem[] =>
  checklists.filter(c => c.is_active).map(c => ({
    checklist_id: c.id.toString(),
    name: c.name,
    item_type: c.item_type || 'boolean',
    true_label: c.true_label || 'มี',
    false_label: c.false_label || 'ไม่มี',
    status: null,
    note: '',
    images: []
  }));

export const prepareFormData = (emergencyId: string, items: ChecklistFormItem[]): FormData => {
  const formData = new FormData();
  formData.append('emergency_id', emergencyId);
  formData.append('checklist_items', JSON.stringify({
    items: items.map(item => ({
      checklist_id: item.checklist_id,
      name: item.name,
      item_type: item.item_type,
      status: item.item_type === 'boolean' ? item.status : true,
      note: item.note
    }))
  }));
  items.forEach(item => {
    item.images.forEach(file => formData.append(`images_${item.checklist_id}`, file));
  });
  return formData;
};

export const submitForm = async (formData: FormData): Promise<{ success: boolean; message?: string }> => {
  try {
    const token = AuthToken.getToken();
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EMERGENCY_CHECKED.ADD}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    return res.json();
  } catch {
    return { success: false, message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' };
  }
};
