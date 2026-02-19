import { useState } from 'react';
import { Button } from '@/components/buttonClick/mainButton';
import { AddFormProps } from '@/app/main/carList/component/add/utils/types';

export default function AddForm({ loading, onSubmit, onCancel }: AddFormProps) {
  const [licensePlateName, setLicensePlateName] = useState('');

  const handleSubmit = () => {
    if (!licensePlateName.trim()) {
      return;
    }
    onSubmit({ license_plate_name: licensePlateName.trim() });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          ทะเบียนรถ <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={licensePlateName}
          onChange={(e) => setLicensePlateName(e.target.value)}
          placeholder="กรอกทะเบียนรถ"
          disabled={loading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 font-bold"
        />
      </div>

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="pastel"
          onClick={handleSubmit}
          loading={loading}
          disabled={loading || !licensePlateName.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base font-bold"
        >
          บันทึก
        </Button>
      </div>
    </div>
  );
}
