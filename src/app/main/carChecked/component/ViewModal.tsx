import { Modal } from '@/components/modal/mainModal';
import { CarCheckedItem } from '@/app/main/carChecked/utils/types';
import ChecklistItemCard from '@/app/main/carChecked/component/ChecklistItemCard';
import { useRef, useEffect } from 'react';

interface ViewModalProps {
  item: CarCheckedItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEditItem?: (carCheckedId: number, checklistItem: any) => void;
}

export default function ViewModal({ item, isOpen, onClose, onEditItem }: ViewModalProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);
  const currentItemIdRef = useRef<number | null>(null);

  // เก็บ scroll position ทุกครั้งที่เลื่อน
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const handleScroll = () => {
        scrollPositionRef.current = container.scrollTop;
      };
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Reset scroll เมื่อเปิด modal ใหม่เท่านั้น
  useEffect(() => {
    if (!item || !isOpen) return;

    const newItemId = item.id;
    const previousItemId = currentItemIdRef.current;

    // ถ้าเป็นคนละ item → reset scroll
    if (previousItemId !== newItemId) {
      scrollPositionRef.current = 0;
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }

    currentItemIdRef.current = newItemId;
  }, [item?.id, isOpen]);

  if (!item) return null;

  const totalItems = item.checklist_items.items.length;
  const passedItems = item.checklist_items.items.filter(i => i.status).length;
  const percentage = totalItems > 0 ? Math.round((passedItems / totalItems) * 100) : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ดูรายละเอียดหรือแก้ไขข้อมูล"
      showCloseButton={true}
      contentClassName="!max-w-5xl"
    >
      <div className="flex flex-col max-h-[80vh]">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <span 
              className="material-symbols-outlined text-3xl text-gray-700"
              style={{
                fontVariationSettings: "'wght' 700",
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                transition: 'all 0.3s ease'
              }}
            >
              local_shipping
            </span>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{item.license_plate_name}</h2>
              <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                <span 
                  className="material-symbols-outlined text-base"
                  style={{
                    fontVariationSettings: "'wght' 700",
                    fontSize: 'clamp(1rem, 5vw, 1.5rem)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  calendar_today
                </span>
                <span className="font-bold">{item.checked_date}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-gray-50 border-b font-bold">
          <p className="text-sm text-gray-600">
            สถานะ: ผ่าน {passedItems}/{totalItems} รายการ ({percentage}%)
          </p>
        </div>

        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6">
          <h3 className="text-base font-bold text-gray-800 mb-2">รายการตรวจสอบ</h3>
          <p className="text-xs text-gray-500 mb-4 flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined text-sm">info</span>
            หากต้องการแก้ไขข้อมูล ให้กดที่ปุ่มแก้ไขของรายการนั้นๆ
          </p>
          <div className="space-y-4">
            {item.checklist_items.items.map((checklistItem, index) => (
              <ChecklistItemCard
                key={checklistItem.checklist_id}
                item={checklistItem}
                index={index}
                onEdit={onEditItem ? () => onEditItem(item.id, checklistItem) : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
