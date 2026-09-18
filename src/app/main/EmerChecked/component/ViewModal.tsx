'use client';

import { Modal } from '@/components/modal/mainModal';
import { EmerCheckedItem } from '@/app/main/EmerChecked/utils/types';
import ChecklistItemCard from '@/app/main/EmerChecked/component/ChecklistItemCard';
import { useRef, useEffect } from 'react';

interface ViewModalProps {
  item: EmerCheckedItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEditItem?: (emerCheckedId: number, checklistItem: any) => void;
}

export default function ViewModal({ item, isOpen, onClose, onEditItem }: ViewModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPos = useRef(0);
  const currentId = useRef<number | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => { scrollPos.current = el.scrollTop; };
    el.addEventListener('scroll', handler);
    return () => el.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (!item || !isOpen) return;
    if (currentId.current !== item.id) { scrollPos.current = 0; if (scrollRef.current) scrollRef.current.scrollTop = 0; }
    currentId.current = item.id;
  }, [item?.id, isOpen]);

  if (!item) return null;

  const boolItems = item.checklist_items.items.filter(i => i.item_type === 'boolean');
  const total = boolItems.length;
  const passed = boolItems.filter(i => i.status).length;
  const pct = total > 0 ? Math.round((passed / total) * 100) : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ดูรายละเอียดหรือแก้ไขข้อมูล" showCloseButton contentClassName="!max-w-5xl">
      <div className="flex flex-col max-h-[80vh]">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl text-gray-700" style={{ fontVariationSettings: "'wght' 700" }}>emergency</span>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{item.license_plate_name}</h2>
              <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'wght' 700" }}>calendar_today</span>
                <span className="font-bold">{item.checked_date}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-3 bg-gray-50 border-b font-bold">
          <p className="text-sm text-gray-600">สถานะ: ผ่าน {passed}/{total} รายการ ({pct}%)</p>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
          <h3 className="text-base font-bold text-gray-800 mb-2">รายการตรวจสอบ</h3>
          <p className="text-xs text-gray-500 mb-4 flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined text-sm">info</span>
            หากต้องการแก้ไขข้อมูล ให้กดที่ปุ่มแก้ไขของรายการนั้นๆ
          </p>
          <div className="space-y-4">
            {item.checklist_items.items.map((checklistItem, index) => (
              <ChecklistItemCard key={checklistItem.checklist_id} item={checklistItem} index={index}
                onEdit={onEditItem ? () => onEditItem(item.id, checklistItem) : undefined} />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
