'use client';

import { useState } from 'react';
import { Button } from '@/components/buttonClick/mainButton';
import { AddParcelListFormData } from './utils/types';

interface AddFormProps { loading: boolean; onSubmit: (data: AddParcelListFormData) => void; onCancel: () => void; }

export default function AddForm({ loading, onSubmit, onCancel }: AddFormProps) {
  const [name, setName] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">ชื่อพัสดุ <span className="text-red-500">*</span></label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
          placeholder="กรอกชื่อพัสดุ" disabled={loading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-100 font-bold text-gray-900" />
      </div>
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="pastel" onClick={onCancel} disabled={loading} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 font-bold">ยกเลิก</Button>
        <Button type="button" variant="pastel" onClick={() => { if (name.trim()) onSubmit({ name: name.trim() }); }} loading={loading}
          disabled={loading || !name.trim()} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-bold">บันทึก</Button>
      </div>
    </div>
  );
}
