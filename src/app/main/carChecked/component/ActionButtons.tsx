import { CarCheckedItem } from '@/app/main/carChecked/utils/types';

interface ActionButtonsProps {
  item: CarCheckedItem;
  showDelete: boolean;
  showPrint: boolean;
  onView: (item: CarCheckedItem) => void;
  onEdit: (item: CarCheckedItem) => void;
  onDelete: (item: CarCheckedItem) => void;
  onPrint: (item: CarCheckedItem) => void;
}

export default function ActionButtons({ item, showDelete, showPrint, onView, onEdit, onDelete, onPrint }: ActionButtonsProps) {
  return (
    <div className="flex gap-1.5 justify-center">
      <button
        onClick={() => onView(item)}
        className="p-1 text-cyan-500 hover:opacity-70 transition-opacity cursor-pointer"
        title="ดูรายละเอียด"
      >
        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'wght' 600" }}>visibility</span>
      </button>

      {showPrint && (
        <button
          onClick={() => onPrint(item)}
          className="p-1 text-blue-600 hover:opacity-70 transition-opacity cursor-pointer"
          title="พิมพ์"
        >
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'wght' 600" }}>print</span>
        </button>
      )}
      
      <button
        onClick={() => onEdit(item)}
        className="p-1 text-yellow-500 hover:opacity-70 transition-opacity cursor-pointer"
        title="แก้ไข"
      >
        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'wght' 600" }}>edit</span>
      </button>
      
      {showDelete && (
        <button
          onClick={() => onDelete(item)}
          className="p-1 text-red-500 hover:opacity-70 transition-opacity cursor-pointer"
          title="ลบ"
        >
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'wght' 600" }}>delete</span>
        </button>
      )}
    </div>
  );
}
