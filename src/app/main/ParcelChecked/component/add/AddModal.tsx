'use client';

import { useState } from 'react';
import { Modal } from '@/components/modal/mainModal';
import AddForm from '@/app/main/ParcelChecked/component/add/AddForm';
import { ParcelOption } from '@/app/main/ParcelChecked/utils/types';
import { ParcelChecklistItem } from '@/app/main/ParcelChecklist/utils/types';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  emergencies: ParcelOption[];
  checklists: ParcelChecklistItem[];
}

export default function AddModal({ isOpen, onClose, onSuccess, emergencies, checklists }: AddModalProps) {
  const [loading, setLoading] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="เพิ่มข้อมูลการตรวจสอบ" showCloseButton contentClassName="!max-w-3xl !max-h-[95vh] !overflow-y-auto">
      <AddForm
        emergencies={emergencies}
        checklists={checklists}
        loading={loading}
        setLoading={setLoading}
        onSuccess={() => { onSuccess?.(); onClose(); }}
        onCancel={onClose}
      />
    </Modal>
  );
}
