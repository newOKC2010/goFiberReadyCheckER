'use client';

import { useState } from 'react';
import { Modal } from '@/components/modal/mainModal';
import UpdateForm from './UpdateForm';
import { handleUpdateSubmit } from './utils/submitHandler';
import { ChecklistItem } from '@/app/main/carChecklist/utils/types';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item: ChecklistItem | null;
}

export default function UpdateModal({ isOpen, onClose, onSuccess, item }: UpdateModalProps) {
  const [loading, setLoading] = useState(false);

  if (!item) return null;

  const handleSubmit = (data: any) => {
    handleUpdateSubmit(
      data,
      () => {
        onSuccess();
        onClose();
      },
      setLoading
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="แก้ไข Checklist"
      showCloseButton={true}
      contentClassName="!max-w-lg"
    >
      <UpdateForm
        item={item}
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}
