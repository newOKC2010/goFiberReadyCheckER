'use client';

import { useState } from 'react';
import { Modal } from '@/components/modal/mainModal';
import AddForm from '@/app/main/carList/component/add/AddForm';
import { handleAddSubmit } from '@/app/main/carList/component/add/utils/submitHandler';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddModal({ isOpen, onClose, onSuccess }: AddModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  const handleSubmit = async (data: any) => {
    await handleAddSubmit(data, setLoading, handleSuccess);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="เพิ่มทะเบียนรถพยาบาล"
      showCloseButton={!loading}
    >
      <AddForm
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}
