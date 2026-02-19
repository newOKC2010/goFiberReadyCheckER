'use client';

import { useState } from 'react';
import { Modal } from '@/components/modal/mainModal';
import UpdateForm from '@/app/main/carList/component/update/UpdateForm';
import { handleUpdateSubmit } from '@/app/main/carList/component/update/utils/submitHandler';
import { CarItem } from '@/app/main/carList/utils/types';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item: CarItem | null;
}

export default function UpdateModal({ isOpen, onClose, onSuccess, item }: UpdateModalProps) {
  const [loading, setLoading] = useState(false);

  if (!item) return null;

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  const handleSubmit = async (data: any) => {
    await handleUpdateSubmit(data, setLoading, handleSuccess);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="แก้ไขรถพยาบาล"
      showCloseButton={!loading}
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
