import { EmerCheckedItem } from '@/app/main/EmerChecked/utils/types';

interface ActionButtonsProps {
  item: EmerCheckedItem;
  showDelete: boolean;
  showPrint: boolean;
  onView: (item: EmerCheckedItem) => void;
  onDelete: (item: EmerCheckedItem) => void;
  onPrint: (item: EmerCheckedItem) => void;
}

export default function ActionButtons({ item, showDelete, showPrint, onView, onDelete, onPrint }: ActionButtonsProps) {
  return (
    <div className="flex gap-1.5 justify-center">
      <button onClick={() => onView(item)} className="p-1 text-cyan-500 hover:opacity-70 transition-opacity cursor-pointer" title="ดูรายละเอียด">
        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'wght' 600" }}>visibility</span>
      </button>
      {showPrint && (
        <button onClick={() => onPrint(item)} className="p-1 text-blue-600 hover:opacity-70 transition-opacity cursor-pointer" title="พิมพ์">
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'wght' 600" }}>print</span>
        </button>
      )}
      {showDelete && (
        <button onClick={() => onDelete(item)} className="p-1 text-red-500 hover:opacity-70 transition-opacity cursor-pointer" title="ลบ">
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'wght' 600" }}>delete</span>
        </button>
      )}
    </div>
  );
}
