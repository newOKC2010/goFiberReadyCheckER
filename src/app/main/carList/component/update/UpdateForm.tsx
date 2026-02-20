import { useState } from 'react';
import { Button } from '@/components/buttonClick/mainButton';
import { UpdateFormProps } from '@/app/main/carList/component/update/utils/types';

export default function UpdateForm({ item, loading, onSubmit, onCancel }: UpdateFormProps) {
  const [licensePlateName, setLicensePlateName] = useState(item.license_plate_name);
  const [active, setActive] = useState(item.active);

  const handleSubmit = () => {
    if (!licensePlateName.trim()) {
      return;
    }
    onSubmit({
      car_id: item.id,
      license_plate_name: licensePlateName.trim(),
      active
    });
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 font-bold text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">สถานะ</label>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={active}
              onChange={() => setActive(true)}
              disabled={loading}
              className="w-4 h-4 font-bold"
            />
            <span className="font-bold">ใช้งาน</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={!active}
              onChange={() => setActive(false)}
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
          disabled={loading || !licensePlateName.trim()}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-base font-bold"
        >
          บันทึก
        </Button>
      </div>
    </div>
  );
}
