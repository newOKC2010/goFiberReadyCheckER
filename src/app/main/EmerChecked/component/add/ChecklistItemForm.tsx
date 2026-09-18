'use client';

import ImageUploader from '@/app/main/EmerChecked/component/add/ImageUploader';
import { ChecklistFormItem } from '@/app/main/EmerChecked/component/add/utils/types';

interface Props {
  item: ChecklistFormItem;
  index: number;
  hasError?: boolean;
  onUpdate: (field: keyof ChecklistFormItem, value: any) => void;
}

export default function ChecklistItemForm({ item, index, hasError = false, onUpdate }: Props) {
  const isBoolean = item.item_type === 'boolean';

  return (
    <div className={`border rounded-lg p-4 bg-gray-50 transition-all ${hasError ? 'border-red-500 border-2 shadow-lg shadow-red-200' : 'border-gray-300'}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white text-sm flex-shrink-0">{index + 1}</div>
        <h4 className="text-gray-800 font-bold">{item.name}</h4>
      </div>

      {isBoolean ? (
        /* Boolean: แสดง radio ด้วย true_label / false_label ที่กำหนดเอง */
        <div className="mb-3">
          <label className="block text-sm text-gray-700 mb-2 font-bold">
            สถานะ <span className="text-red-500">*</span>
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
              <span className="text-sm text-green-600 font-bold">{item.true_label}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`status_${item.checklist_id}`}
                checked={item.status === false}
                onChange={() => onUpdate('status', false)}
                className="w-4 h-4 text-red-600 cursor-pointer"
              />
              <span className="text-sm text-red-600 font-bold">{item.false_label}</span>
            </label>
          </div>
          {/* หมายเหตุ (optional) */}
          <div className="mt-3">
            <label className="block text-sm text-gray-700 mb-1 font-bold">หมายเหตุ</label>
            <textarea
              value={item.note}
              onChange={(e) => onUpdate('note', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder:font-bold"
              rows={2}
              placeholder="เพิ่มหมายเหตุ (ถ้ามี)"
            />
          </div>
        </div>
      ) : (
        /* Plain text: กรอกข้อความ */
        <div className="mb-3">
          <label className="block text-sm text-gray-700 mb-1 font-bold">
            ข้อมูล <span className="text-red-500">*</span>
          </label>
          <textarea
            value={item.note}
            onChange={(e) => onUpdate('note', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md text-sm text-gray-900 placeholder:font-bold ${hasError ? 'border-red-500' : 'border-gray-300'}`}
            rows={3}
            placeholder="กรอกข้อมูล..."
          />
        </div>
      )}

      <ImageUploader
        checklistId={item.checklist_id}
        images={item.images}
        onImagesChange={(images: File[]) => onUpdate('images', images)}
      />
    </div>
  );
}
