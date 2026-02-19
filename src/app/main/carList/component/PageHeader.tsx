import { Button } from '@/components/buttonClick/mainButton';

interface PageHeaderProps {
  onAdd: () => void;
  showAddButton: boolean;
}

export default function PageHeader({ onAdd, showAddButton }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-4xl text-blue-600" style={{ fontVariationSettings: "'wght' 700" }}>
          local_shipping
        </span>
        <h1 className="text-2xl font-bold text-gray-800">รายการทะเบียนรถพยาบาล</h1>
      </div>
      {showAddButton && (
        <Button
          onClick={onAdd}
          variant="pastel"
          icon="add"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <span style={{
            fontVariationSettings: "'wght' 700",
            transition: 'all 0.3s ease'
          }}>
            เพิ่มทะเบียนรถพยาบาล
          </span>
        </Button>
      )}
    </div>
  );
}
