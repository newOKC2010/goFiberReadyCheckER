import { showAlert } from '@/global/globalSwal';
import { API_BASE_URL, API_ENDPOINTS } from '@/global/globalApi';
import { AuthToken } from '@/global/globalAuth';
import { ChecklistItem } from '@/app/main/carChecked/component/add/utils/types';
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

export const validateForm = (selectedCarId: string, checklistItems: ChecklistItem[]): { isValid: boolean; errorField?: string } => {
  if (!selectedCarId) {
    showAlert('ข้อผิดพลาด', 'กรุณาเลือกทะเบียนรถ', 'error');
    return { isValid: false, errorField: 'car' };
  }

  const hasEmptyStatus = checklistItems.some(item => item.status === null);
  if (hasEmptyStatus) {
    showAlert('ข้อผิดพลาด', 'กรุณาเลือกสถานะการตรวจสอบทุกรายการ', 'error');
    return { isValid: false, errorField: 'checklist' };
  }

  return { isValid: true };
};

export const prepareFormData = (selectedCarId: string, checklistItems: ChecklistItem[]): FormData => {
  const formData = new FormData();
  formData.append('car_id', selectedCarId);
  
  // ส่ง checklist_items เป็น JSON โดยไม่มี images field
  formData.append('checklist_items', JSON.stringify({ 
    items: checklistItems.map((item) => ({
      checklist_id: item.checklist_id,
      name: item.name,
      note: item.note,
      status: item.status
    })) 
  }));

  // ส่งไฟล์รูปแยกเป็น field images_{checklist_id}
  checklistItems.forEach((item) => {
    if (item.images.length > 0) {
      item.images.forEach((file) => {
        formData.append(`images_${item.checklist_id}`, file);
      });
    }
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
