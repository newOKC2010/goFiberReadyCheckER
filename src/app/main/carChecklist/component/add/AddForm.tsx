import { useState } from 'react';
import { Button } from '@/components/buttonClick/mainButton';
import Dropdown from '@/components/dropdown/mainDropdown';
import { AddFormProps } from '@/app/main/carChecklist/component/add/utils/types';

const ROLE_OPTIONS = [
  { value: 'user',   label: 'ผู้ใช้งาน (user)' },
  { value: 'driver', label: 'คนขับ (driver)' },
];

export default function AddForm({ loading, onSubmit, onCancel }: AddFormProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), role });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          ชื่อ รายการตรวจสอบ <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="กรอกชื่อ Checklist"
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

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="pastel"
          onClick={handleSubmit}
          loading={loading}
          disabled={loading || !name.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base font-bold"
        >
          บันทึก
        </Button>
      </div>
    </div>
  );
}
