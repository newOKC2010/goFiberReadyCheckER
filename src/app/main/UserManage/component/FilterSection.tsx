'use client';

import { useState } from 'react';
import Dropdown from '@/components/dropdown/mainDropdown';
import { UserFilter } from '@/app/main/UserManage/service/serviceUserManage';

interface FilterSectionProps {
  callerRole: string;
  onSearch: (filter: UserFilter) => void;
}

const ROLE_OPTIONS_ADMIN = [
  { value: '', label: 'ทุก Role' },
  { value: 'anonymous', label: 'รอการอนุมัติ (anonymous)' },
  { value: 'user', label: 'ผู้ใช้งาน (user)' },
  { value: 'driver', label: 'คนขับ (driver)' },
];

const ROLE_OPTIONS_SUPER = [
  ...ROLE_OPTIONS_ADMIN,
  { value: 'admin', label: 'ผู้ดูแล (admin)' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'ทุกสถานะ' },
  { value: 'true', label: 'ใช้งาน' },
  { value: 'false', label: 'รอการอนุมัติ / ระงับ' },
];

export default function FilterSection({ callerRole, onSearch }: FilterSectionProps) {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ search, role, status });
  };

  const handleClear = () => {
    setSearch('');
    setRole('');
    setStatus('');
    onSearch({});
  };

  const roleOptions = callerRole === 'super_admin' ? ROLE_OPTIONS_SUPER : ROLE_OPTIONS_ADMIN;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">ค้นหาชื่อ</label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="กรอกชื่อ-นามสกุล"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:font-bold"
          />
        </div>
        <Dropdown
          options={roleOptions}
          value={role}
          onChange={setRole}
          label="Role"
          placeholder="ทุก Role"
          className="w-full"
        />
        <Dropdown
          options={STATUS_OPTIONS}
          value={status}
          onChange={setStatus}
          label="สถานะ"
          placeholder="ทุกสถานะ"
          className="w-full"
        />
      </div>
      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={handleClear}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'wght' 600" }}>restart_alt</span>
          ล้างการค้นหา
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'wght' 600" }}>search</span>
          ค้นหา
        </button>
      </div>
    </form>
  );
}
