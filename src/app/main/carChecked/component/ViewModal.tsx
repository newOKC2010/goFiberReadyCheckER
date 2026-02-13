import { Modal } from '@/components/modal/mainModal';
import { CarCheckedItem } from '@/app/main/carChecked/utils/types';
import ChecklistItemCard from '@/app/main/carChecked/component/ChecklistItemCard';

interface ViewModalProps {
  item: CarCheckedItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewModal({ item, isOpen, onClose }: ViewModalProps) {
  if (!item) return null;

  const totalItems = item.checklist_items.items.length;
  const passedItems = item.checklist_items.items.filter(i => i.status).length;
  const percentage = totalItems > 0 ? Math.round((passedItems / totalItems) * 100) : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      showCloseButton={true}
      contentClassName="!max-w-5xl !p-0"
    >
      <div className="flex flex-col max-h-[80vh]">
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-t-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-4xl text-blue-600" style={{ fontVariationSettings: "'wght' 700" }}>
              local_shipping
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{item.license_plate_name}</h2>
              <p className="text-gray-700 flex items-center gap-2 mt-1 font-bold">
                <span className="material-symbols-outlined text-lg">calendar_today</span>
                {item.checked_date}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-gray-500 font-bold">สถานะการตรวจสอบ</p>
              <p className="font-bold text-gray-800">
                ผ่าน {passedItems}/{totalItems} รายการ ({percentage}%)
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 rounded-b-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-gray-700 text-2xl" style={{ fontVariationSettings: "'wght' 700" }}>checklist</span>
            <h3 className="text-xl font-bold text-gray-800">รายการตรวจสอบ</h3>
          </div>

          <div className="space-y-4">
            {item.checklist_items.items.map((checklistItem, index) => (
              <ChecklistItemCard
                key={checklistItem.checklist_id}
                item={checklistItem}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
