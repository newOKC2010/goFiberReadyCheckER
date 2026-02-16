import { showAlert } from '@/global/globalSwal';
import { API_BASE_URL, API_ENDPOINTS } from '@/global/globalApi';
import { AuthToken } from '@/global/globalAuth';
import { ChecklistItem } from './types';
import { ChecklistOption } from '@/app/main/carChecked/utils/types';

export const initializeChecklistItems = (checklists: ChecklistOption[]): ChecklistItem[] => {
  return checklists.filter(c => c.is_active).map(checklist => ({
    checklist_id: checklist.id.toString(),
    name: checklist.name,
    note: '',
    status: null,
    images: []
  }));
};

export const validateForm = (selectedCarId: string, checklistItems: ChecklistItem[]): boolean => {
  if (!selectedCarId) {
    showAlert('ข้อผิดพลาด', 'กรุณาเลือกรถ', 'error');
    return false;
  }

  const hasEmptyStatus = checklistItems.some(item => item.status === null);
  if (hasEmptyStatus) {
    showAlert('ข้อผิดพลาด', 'กรุณาเลือกสถานะการตรวจสอบทุกรายการ', 'error');
    return false;
  }

  return true;
};

export const prepareFormData = (selectedCarId: string, checklistItems: ChecklistItem[]): FormData => {
  const formData = new FormData();
  formData.append('car_id', selectedCarId);
  formData.append('checklist_items', JSON.stringify({ 
    items: checklistItems.map((item, itemIndex) => ({
      checklist_id: item.checklist_id,
      name: item.name,
      note: item.note,
      status: item.status,
      images: item.images.map(() => `images_${itemIndex + 1}`)
    })) 
  }));

  checklistItems.forEach((item, itemIndex) => {
    item.images.forEach((file) => {
      formData.append(`images_${itemIndex + 1}`, file);
    });
  });

  return formData;
};

export const submitForm = async (formData: FormData): Promise<{ success: boolean; message?: string }> => {
  try {
    const token = AuthToken.getToken();
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CAR_CHECKED.ADD}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    return await response.json();
  } catch (error) {
    return { success: false, message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' };
  }
};
