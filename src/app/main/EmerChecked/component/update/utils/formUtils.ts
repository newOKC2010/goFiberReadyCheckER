import { API_BASE_URL, API_ENDPOINTS } from '@/global/globalApi';
import { AuthToken } from '@/global/globalAuth';

export const fetchImageAsFile = async (imagePath: string): Promise<File | null> => {
  try {
    const token = AuthToken.getToken();
    const url = `${API_BASE_URL}/emergency-checked/view-image/${imagePath.startsWith('/') ? imagePath.substring(1) : imagePath}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return null;
    const blob = await res.blob();
    return new File([blob], imagePath.split('/').pop() || 'image.jpg', { type: blob.type });
  } catch { return null; }
};

export const prepareUpdateFormDataWithFetch = async (
  emerCheckedId: number, checklistId: string, note: string, status: boolean, existingImages: string[], newImages: File[]
): Promise<FormData> => {
  const formData = new FormData();
  formData.append('emergency_checked_id', emerCheckedId.toString());
  formData.append('checklist_id', checklistId);
  formData.append('note', note);
  formData.append('status', status.toString());

  if (existingImages.length > 0 || newImages.length > 0) {
    const fieldName = `images_${checklistId}`;
    const existingFiles = await Promise.all(existingImages.map(fetchImageAsFile));
    existingFiles.forEach(f => { if (f) formData.append(fieldName, f); });
    newImages.forEach(f => formData.append(fieldName, f));
  }
  return formData;
};

export const submitUpdate = async (formData: FormData): Promise<{ success: boolean; message?: string }> => {
  try {
    const token = AuthToken.getToken();
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EMERGENCY_CHECKED.UPDATE}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    return res.json();
  } catch { return { success: false, message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' }; }
};
