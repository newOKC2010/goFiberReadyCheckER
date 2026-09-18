'use client';

import { Modal } from '@/components/modal/mainModal';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddModal({ isOpen, onClose }: AddModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="เพิ่มข้อมูลการตรวจสอบ" showCloseButton contentClassName="!max-w-lg">
      <div className="p-6 text-center text-gray-500 font-bold">
        <span className="material-symbols-outlined text-4xl mb-2 block">construction</span>
        กำลังพัฒนา...
      </div>
    </Modal>
  );
}
