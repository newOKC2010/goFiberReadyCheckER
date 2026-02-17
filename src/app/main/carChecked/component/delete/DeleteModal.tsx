'use client';

import { useState } from 'react';
import { Modal } from '@/components/modal/mainModal';
import DeleteForm from '@/app/main/carChecked/component/delete/DeleteForm';
import { handleDeleteSubmit } from '@/app/main/carChecked/component/delete/utils/submitHandler';
import { CarCheckedItem } from '@/app/main/carChecked/utils/types';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item: CarCheckedItem | null;
}

export default function DeleteModal({ isOpen, onClose, onSuccess, item }: DeleteModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!item) return;
    
    handleDeleteSubmit(
      { car_checked_id: item.id },
      () => {
        onSuccess();
        onClose();
      },
      setLoading
    );
  };

  if (!item) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ยืนยันการลบข้อมูล"
      showCloseButton={true}
      contentClassName="!max-w-lg"
    >
      <DeleteForm
        item={item}
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}
