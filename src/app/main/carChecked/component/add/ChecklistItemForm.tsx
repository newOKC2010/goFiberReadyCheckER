'use client';

import ImageUploader from '@/app/main/carChecked/component/add/ImageUploader';
import { ChecklistItem } from '@/app/main/carChecked/component/add/utils/types';

interface ChecklistItemFormProps {
  item: ChecklistItem;
  index: number;
  hasError?: boolean;
  onUpdate: (field: keyof ChecklistItem, value: any) => void;
}

export default function ChecklistItemForm({ item, index, hasError = false, onUpdate }: ChecklistItemFormProps) {
  return (
    <div className={`border rounded-lg p-4 bg-gray-50 transition-all ${
      hasError ? 'border-red-500 border-2 shadow-lg shadow-red-200' : 'border-gray-300'
    }`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
          {index + 1}
        </div>
        <h4 className="font-bold text-gray-800">{item.name}</h4>
      </div>

      {/* สถานะ */}
      <div className="mb-3">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          สถานะการตรวจสอบ <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={`status_${item.checklist_id}`}
              checked={item.status === true}
              onChange={() => onUpdate('status', true)}
              className="w-4 h-4 text-green-600 cursor-pointer"
            />
            <span className="text-sm font-bold text-green-600">ผ่าน</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={`status_${item.checklist_id}`}
              checked={item.status === false}
              onChange={() => onUpdate('status', false)}
              className="w-4 h-4 text-red-600 cursor-pointer"
            />
            <span className="text-sm font-bold text-red-600">ไม่ผ่าน</span>
          </label>
        </div>
      </div>

      {/* หมายเหตุ */}
      <div className="mb-3">
        <label className="block text-sm font-bold text-gray-700 mb-1">หมายเหตุ</label>
        <textarea
          value={item.note}
          onChange={(e) => onUpdate('note', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-bold text-gray-900"
          rows={2}
          placeholder="เพิ่มหมายเหตุ (ถ้ามี)"
        />
      </div>

      {/* อัปโหลดรูปภาพ */}
      <ImageUploader
        checklistId={item.checklist_id}
        images={item.images}
        onImagesChange={(images) => onUpdate('images', images)}
      />
    </div>
  );
}
