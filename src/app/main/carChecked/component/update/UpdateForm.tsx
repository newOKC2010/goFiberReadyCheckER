'use client';

import { useState } from 'react';
import { Button } from '@/components/buttonClick/mainButton';
import { showAlert } from '@/global/globalSwal';
import UpdateImageManager from '@/app/main/carChecked/component/update/UpdateImageManager';
import { UpdateFormProps } from '@/app/main/carChecked/component/update/utils/types';
import { prepareUpdateFormDataWithFetch, submitUpdate } from '@/app/main/carChecked/component/update/utils/formUtils';

export default function UpdateForm({
  carCheckedId,
  checklistItem,
  loading,
  setLoading,
  onSuccess,
  onCancel
}: UpdateFormProps) {
  const [note, setNote] = useState(checklistItem.note);
  const [status, setStatus] = useState(checklistItem.status);
  const [existingImages, setExistingImages] = useState<string[]>(checklistItem.images ?? []);
  const [newImages, setNewImages] = useState<File[]>([]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const formData = await prepareUpdateFormDataWithFetch(
        carCheckedId,
        checklistItem.checklist_id,
        note,
        status,
        existingImages,
        newImages
      );

      const result = await submitUpdate(formData);

      if (result.success) {
        showAlert('สำเร็จ', 'แก้ไขข้อมูลสำเร็จ', 'success');
        onSuccess();
      } else {
        showAlert('ข้อผิดพลาด', result.message || 'เกิดข้อผิดพลาด', 'error');
      }
    } catch (error) {
      showAlert('ข้อผิดพลาด', 'ไม่สามารถแก้ไขข้อมูลได้', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ชื่อรายการ */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          รายการตรวจสอบ
        </label>
        <div className="px-4 py-3 bg-gray-100 rounded-lg border border-gray-300">
          <p className="font-bold text-gray-800">{checklistItem.name}</p>
        </div>
      </div>

      {/* สถานะ */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          สถานะการตรวจสอบ
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={status === true}
              onChange={() => setStatus(true)}
              className="w-4 h-4 text-green-600 cursor-pointer"
            />
            <span className="text-sm font-bold text-green-600">ผ่าน</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={status === false}
              onChange={() => setStatus(false)}
              className="w-4 h-4 text-red-600 cursor-pointer"
            />
            <span className="text-sm font-bold text-red-600">ไม่ผ่าน</span>
          </label>
        </div>
      </div>

      {/* หมายเหตุ */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">หมายเหตุ</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-bold"
          rows={3}
          placeholder="เพิ่มหมายเหตุ (ถ้ามี)"
        />
      </div>

      {/* รูปภาพ */}
      <UpdateImageManager
        checklistId={checklistItem.checklist_id}
        existingImages={existingImages}
        newImages={newImages}
        onExistingImagesChange={setExistingImages}
        onNewImagesChange={setNewImages}
      />

      {/* ปุ่ม */}
      <div className="flex justify-center gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="pastel"
          onClick={handleSubmit}
          loading={loading}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-bold"
        >
          บันทึกการแก้ไข
        </Button>
      </div>
    </div>
  );
}
