import { useState } from 'react';
import { Button } from '@/components/buttonClick/mainButton';
import { UpdateFormProps } from '@/app/main/EmerChecklist/component/update/utils/types';

export default function UpdateForm({ item, loading, onSubmit, onCancel }: UpdateFormProps) {
  const [name, setName] = useState(item.name);
  const [isActive, setIsActive] = useState(item.is_active);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({ emergency_list_id: item.id, name: name.trim(), is_active: isActive });
  };

  const inputClass = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-100 font-bold text-gray-900';

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          ชื่อรายการ <span className="text-red-500">*</span>
        </label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
          placeholder="กรอกชื่อรายการตรวจสอบ" disabled={loading} className={inputClass} />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">สถานะ</label>
        <div className="flex items-center gap-4">
          {[true, false].map((val) => (
            <label key={String(val)} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={isActive === val} onChange={() => setIsActive(val)}
                disabled={loading} className="w-4 h-4" />
              <span className="font-bold">{val ? 'ใช้งาน' : 'ปิดใช้งาน'}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="pastel" onClick={onCancel} disabled={loading}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 font-bold">
          ยกเลิก
        </Button>
        <Button type="button" variant="pastel" onClick={handleSubmit} loading={loading}
          disabled={loading || !name.trim()}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 font-bold">
          บันทึก
        </Button>
      </div>
    </div>
  );
}
