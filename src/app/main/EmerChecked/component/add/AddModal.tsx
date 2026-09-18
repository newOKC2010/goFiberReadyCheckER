'use client';

import { useState } from 'react';
import { Modal } from '@/components/modal/mainModal';
import AddForm from '@/app/main/EmerChecked/component/add/AddForm';
import { EmerOption } from '@/app/main/EmerChecked/utils/types';
import { EmerChecklistItem } from '@/app/main/EmerChecklist/utils/types';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  emergencies: EmerOption[];
  checklists: EmerChecklistItem[];
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
