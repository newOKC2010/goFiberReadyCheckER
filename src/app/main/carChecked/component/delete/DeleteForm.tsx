import { Button } from '@/components/buttonClick/mainButton';
import { DeleteFormProps } from '@/app/main/carChecked/component/delete/utils/types';

export default function DeleteForm({ item, loading, onSubmit }: DeleteFormProps) {
  return (
    <div className="space-y-6">
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <span 
            className="material-symbols-outlined text-red-500 text-2xl"
            style={{
              fontVariationSettings: "'wght' 700",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              transition: 'all 0.3s ease'
            }}
          >
            warning</span>
          <div>
            <p className="font-bold text-gray-800 mb-2">คุณต้องการลบข้อมูลนี้หรือไม่?</p>
            <div className="space-y-1 text-sm text-gray-700 font-bold">
              <p>ทะเบียนรถ: {item.license_plate_name}</p>
              <p>วันที่ตรวจสอบ: {item.checked_date}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="pastel"
          onClick={onSubmit}
          loading={loading}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-base font-bold"
        >
          ลบข้อมูล
        </Button>
      </div>
    </div>
  );
}
