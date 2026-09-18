'use client';

import { useState } from 'react';
import { Modal } from '@/components/modal/mainModal';
import AddForm from '@/app/main/EmerChecklist/component/add/AddForm';
import { handleAddSubmit } from '@/app/main/EmerChecklist/component/add/utils/submitHandler';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddModal({ isOpen, onClose, onSuccess }: AddModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSuccess = () => { onSuccess(); onClose(); };
  const handleSubmit = async (data: Parameters<typeof handleAddSubmit>[0]) => {
    await handleAddSubmit(data, setLoading, handleSuccess);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="เพิ่มรายการตรวจสอบ Emergency" showCloseButton={!loading}>
      <AddForm loading={loading} onSubmit={handleSubmit} onCancel={onClose} />
    </Modal>
  );
}
