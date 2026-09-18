import { Button } from '@/components/buttonClick/mainButton';

interface PageHeaderProps {
  onAdd?: () => void;
  showAddButton?: boolean;
}

export default function PageHeader({ onAdd, showAddButton = false }: PageHeaderProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-4xl text-red-600" style={{ fontVariationSettings: "'wght' 700" }}>emergency</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">ระบบตรวจสอบรถ Emergency</h1>
            <p className="text-gray-600 font-bold">จัดการข้อมูลการตรวจสอบรถ Emergency</p>
          </div>
        </div>
        {showAddButton && (
          <Button variant="pastel" onClick={onAdd} icon="add" className="bg-green-600 hover:bg-green-700 text-white">
            <span style={{ fontVariationSettings: "'wght' 700" }}>เพิ่มข้อมูล</span>
          </Button>
        )}
      </div>
    </div>
  );
}
