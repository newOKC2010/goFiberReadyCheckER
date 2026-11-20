'use client';

import { useState } from 'react';
import { UserItem } from '@/app/main/UserManage/utils/types';
import { UpdateUserForm } from './utils/types';
import { submitUpdateUser } from './utils/submitHandler';
import { getRoleLabel } from '@/app/main/UserManage/handler/handlerUserManage';
import Dropdown from '@/components/dropdown/mainDropdown';

interface UpdateFormProps {
  item: UserItem;
  onSuccess: () => void;
  onClose: () => void;
}

const ROLE_OPTIONS = [
  { value: 'user',   label: 'ผู้ใช้งาน (user)' },
  { value: 'driver', label: 'คนขับ (driver)' },
  { value: 'admin',  label: 'ผู้ดูแล (admin)' },
];

export default function UpdateForm({ item, onSuccess, onClose }: UpdateFormProps) {
  const [form, setForm] = useState<UpdateUserForm>({
    status: item.status,
    role: item.role === 'anonymous' ? 'user' : item.role,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.status && !['user', 'driver', 'admin'].includes(form.role)) {
      setError('กรุณาเลือก role ให้ถูกต้อง');
      return;
    }
    setLoading(true);
    setError('');
    const result = await submitUpdateUser(item.id, form);
    setLoading(false);
    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setError(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4 space-y-1 text-sm">
        <p className="font-bold">ชื่อ: {item.full_name}</p>
        <p className="font-bold">อีเมล: {item.email}</p>
        <p className="font-bold">Role ปัจจุบัน: {getRoleLabel(item.role)}</p>
      </div>

      {/* สถานะ */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">สถานะบัญชี</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              checked={form.status}
              onChange={() => setForm(f => ({ ...f, status: true }))}
              className="accent-green-600"
            />
            <span className="font-bold text-green-700">อนุมัติ / เปิดใช้งาน</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              checked={!form.status}
              onChange={() => setForm(f => ({ ...f, status: false }))}
              className="accent-red-600"
            />
            <span className="font-bold text-red-700">ระงับการใช้งาน</span>
          </label>
        </div>
      </div>

      {/* Role — แสดงเฉพาะเมื่อ approve */}
      {form.status && (
        <Dropdown
          options={ROLE_OPTIONS}
          value={form.role}
          onChange={val => setForm(f => ({ ...f, role: val }))}
          label="กำหนด Role"
          required={true}
          inModal={true}
          className="w-full"
        />
      )}

      {error && <p className="text-red-600 text-sm font-bold">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'กำลังบันทึก...' : 'บันทึก'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors"
        >
          ยกเลิก
        </button>
      </div>
    </form>
  );
}
