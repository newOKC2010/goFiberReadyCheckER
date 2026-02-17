import { showAlert } from '@/global/globalSwal';
import { API_BASE_URL, API_ENDPOINTS } from '@/global/globalApi';
import { AuthToken } from '@/global/globalAuth';

export const prepareUpdateFormData = (
  carCheckedId: number,
  checklistId: string,
  note: string,
  status: boolean,
  existingImages: string[],
  newImages: File[]
): FormData => {
  const formData = new FormData();
  
  formData.append('car_checked_id', carCheckedId.toString());
  formData.append('checklist_id', checklistId);
  formData.append('note', note);
  formData.append('status', status.toString());

  // ส่งรูปทั้งหมด (เก่า + ใหม่) ใน field images_{checklist_id}
  const fieldName = `images_${checklistId}`;
  
  // ถ้าไม่มีรูปเลย ส่ง field ว่างเพื่อลบทั้งหมด
  if (existingImages.length === 0 && newImages.length === 0) {
    formData.append(fieldName, '');
  } else {
    // ส่งรูปเก่าที่เหลืออยู่
    existingImages.forEach((imagePath) => {
      // ต้อง fetch รูปเก่ามาแปลงเป็น File ก่อนส่ง
      // หรือส่ง path ไปให้ backend จัดการ (ขึ้นกับ backend design)
      // ตอนนี้จะต้อง fetch มาแปลงเป็น blob/file
    });
    
    // ส่งรูปใหม่
    newImages.forEach((file) => {
      formData.append(fieldName, file);
    });
  }

  return formData;
};

export const submitUpdate = async (formData: FormData): Promise<{ success: boolean; message?: string }> => {
  try {
    const token = AuthToken.getToken();
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CAR_CHECKED.UPDATE}`, {
      method: 'PUT',
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

// Helper: แปลง image path เป็น File object
export const fetchImageAsFile = async (imagePath: string): Promise<File | null> => {
  try {
    const token = AuthToken.getToken();
    const url = `${API_BASE_URL}/car-checked/view-image/${imagePath.startsWith('/') ? imagePath.substring(1) : imagePath}`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
      const blob = await response.blob();
      const filename = imagePath.split('/').pop() || 'image.jpg';
      return new File([blob], filename, { type: blob.type });
    }
    return null;
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
};

// Prepare FormData with existing images converted to Files
export const prepareUpdateFormDataWithFetch = async (
  carCheckedId: number,
  checklistId: string,
  note: string,
  status: boolean,
  existingImages: string[],
  newImages: File[]
): Promise<FormData> => {
  const formData = new FormData();
  
  formData.append('car_checked_id', carCheckedId.toString());
  formData.append('checklist_id', checklistId);
  formData.append('note', note);
  formData.append('status', status.toString());

  // ถ้าไม่มีรูปเลย (ไม่มีรูปเดิม และไม่เพิ่มรูปใหม่) → ไม่ส่ง images field
  // Backend จะลบรูปทั้งหมด
  if (existingImages.length === 0 && newImages.length === 0) {
    // ไม่ส่ง images field
  } else {
    // ถ้ามีรูป (มีรูปเดิม หรือ เพิ่มรูปใหม่) → ส่ง images field ทุกครั้ง
    // แม้จะแก้แค่ status/note ก็ต้องส่งรูปเดิมไปด้วย เพื่อแทนที่รูปทั้งหมด
    const fieldName = `images_${checklistId}`;
    
    // Fetch รูปเก่าและแปลงเป็น File (ส่งทุกครั้งถ้ามี)
    const existingFiles = await Promise.all(
      existingImages.map(path => fetchImageAsFile(path))
    );
    
    // ส่งรูปเก่า
    existingFiles.forEach((file) => {
      if (file) {
        formData.append(fieldName, file);
      }
    });
    
    // ส่งรูปใหม่
    newImages.forEach((file) => {
      formData.append(fieldName, file);
    });
  }

  return formData;
};
