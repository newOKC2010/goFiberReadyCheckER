import { useState } from 'react';
import { Button } from '@/components/buttonClick/mainButton';
import Dropdown from '@/components/dropdown/mainDropdown';
import { UpdateFormProps } from '@/app/main/carChecklist/component/update/utils/types';

const ROLE_OPTIONS = [
  { value: 'user',   label: 'ผู้ใช้งาน (user)' },
  { value: 'driver', label: 'คนขับ (driver)' },
];

export default function UpdateForm({ item, loading, onSubmit, onCancel }: UpdateFormProps) {
  const [name, setName] = useState(item.name);
  const [role, setRole] = useState(item.role || 'user');
  const [isActive, setIsActive] = useState(item.is_active);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({
      checklist_id: item.id,
      name: name.trim(),
      role,
      is_active: isActive
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          ชื่อรายการตรวจสอบ <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="กรอกชื่อรายการตรวจสอบ"
          disabled={loading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 font-bold text-gray-900"
        />
      </div>

      <Dropdown
        options={ROLE_OPTIONS}
        value={role}
        onChange={setRole}
        label="ใช้กับผู้ใช้ประเภท"
        required={true}
        inModal={true}
        className="w-full"
      />

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">สถานะ</label>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={isActive}
              onChange={() => setIsActive(true)}
              disabled={loading}
              className="w-4 h-4 font-bold"
            />
            <span className="font-bold">ใช้งาน</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={!isActive}
              onChange={() => setIsActive(false)}
              disabled={loading}
              className="w-4 h-4 font-bold"
            />
            <span className="font-bold">ปิดใช้งาน</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="pastel"
          onClick={handleSubmit}
          loading={loading}
          disabled={loading || !name.trim()}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-base font-bold"
        >
          บันทึก
        </Button>
      </div>
    </div>
  );
}
