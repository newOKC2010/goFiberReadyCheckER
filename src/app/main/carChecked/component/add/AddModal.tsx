'use client';

import { useState } from 'react';
import { Modal } from '@/components/modal/mainModal';
import AddForm from '@/app/main/carChecked/component/add/AddForm';
import { CarOption, ChecklistOption } from '@/app/main/carChecked/utils/types';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  cars: CarOption[];
  checklists: ChecklistOption[];
}

export default function AddModal({ isOpen, onClose, onSuccess, cars, checklists }: AddModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="เพิ่มข้อมูลการตรวจสอบรถ"
      showCloseButton={true}
      contentClassName="!max-w-4xl"
    >
      <AddForm
        cars={cars}
        checklists={checklists}
        loading={loading}
        setLoading={setLoading}
        onSuccess={handleSuccess}
        onCancel={onClose}
      />
    </Modal>
  );
}
