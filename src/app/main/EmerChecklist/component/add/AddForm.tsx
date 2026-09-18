'use client';

import { useState } from 'react';
import { Button } from '@/components/buttonClick/mainButton';
import { AddEmerChecklistFormData } from '@/app/main/EmerChecklist/component/add/utils/types';

interface AddFormProps {
  loading: boolean;
  onSubmit: (data: AddEmerChecklistFormData) => void;
  onCancel: () => void;
}

export default function AddForm({ loading, onSubmit, onCancel }: AddFormProps) {
  const [name, setName] = useState('');
  const [itemType, setItemType] = useState<'boolean' | 'text'>('boolean');
  const [trueLabel, setTrueLabel] = useState('มี');
  const [falseLabel, setFalseLabel] = useState('ไม่มี');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), item_type: itemType, true_label: trueLabel, false_label: falseLabel });
  };

  const inputClass = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-100 font-bold text-gray-900';

  return (
    <div className="space-y-5">
      {/* ชื่อรายการ */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          ชื่อรายการ <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="กรอกชื่อรายการตรวจสอบ"
          disabled={loading}
          className={inputClass}
        />
      </div>

      {/* ประเภทรายการ */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">ประเภทรายการ</label>
        <div className="flex gap-3">
          {(['boolean', 'text'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setItemType(type)}
              disabled={loading}
              className={`flex-1 py-3 rounded-lg font-bold text-sm border-2 transition-all cursor-pointer
                ${itemType === type
                  ? 'border-red-500 bg-red-50 text-red-600'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }`}
            >
              {type === 'boolean' ? 'ตัวเลือก (มี/ไม่มี)' : 'ข้อความอิสระ'}
            </button>
          ))}
        </div>
      </div>

      {/* Label สำหรับ boolean */}
      {itemType === 'boolean' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ป้ายกำกับ "ผ่าน"</label>
            <input
              type="text"
              value={trueLabel}
              onChange={(e) => setTrueLabel(e.target.value)}
              placeholder="เช่น มี, พร้อม"
              disabled={loading}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ป้ายกำกับ "ไม่ผ่าน"</label>
            <input
              type="text"
              value={falseLabel}
              onChange={(e) => setFalseLabel(e.target.value)}
              placeholder="เช่น ไม่มี, ไม่พร้อม"
              disabled={loading}
              className={inputClass}
            />
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-end pt-1">
        <Button type="button" variant="pastel" onClick={onCancel} disabled={loading}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 font-bold">
          ยกเลิก
        </Button>
        <Button type="button" variant="pastel" onClick={handleSubmit} loading={loading}
          disabled={loading || !name.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-bold">
          บันทึก
        </Button>
      </div>
    </div>
  );
}
