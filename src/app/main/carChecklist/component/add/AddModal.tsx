'use client';

import { useState } from 'react';
import { Modal } from '@/components/modal/mainModal';
import AddForm from '@/app/main/carChecklist/component/add/AddForm';
import { handleAddSubmit } from '@/app/main/carChecklist/component/add/utils/submitHandler';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddModal({ isOpen, onClose, onSuccess }: AddModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (data: { name: string }) => {
    handleAddSubmit(
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
      title="เพิ่ม Checklist"
      showCloseButton={true}
      contentClassName="!max-w-lg"
    >
      <AddForm
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}
