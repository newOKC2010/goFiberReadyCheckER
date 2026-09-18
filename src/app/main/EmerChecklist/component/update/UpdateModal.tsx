'use client';

import { useState } from 'react';
import { Modal } from '@/components/modal/mainModal';
import UpdateForm from '@/app/main/EmerChecklist/component/update/UpdateForm';
import { handleUpdateSubmit } from '@/app/main/EmerChecklist/component/update/utils/submitHandler';
import { EmerChecklistItem } from '@/app/main/EmerChecklist/utils/types';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item: EmerChecklistItem | null;
}

export default function UpdateModal({ isOpen, onClose, onSuccess, item }: UpdateModalProps) {
  const [loading, setLoading] = useState(false);

  if (!item) return null;

  const handleSubmit = (data: Parameters<typeof handleUpdateSubmit>[0]) => {
    handleUpdateSubmit(data, setLoading, () => { onSuccess(); onClose(); });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="แก้ไขรายการตรวจสอบ Emergency" showCloseButton={!loading}>
      <UpdateForm item={item} loading={loading} onSubmit={handleSubmit} onCancel={onClose} />
    </Modal>
  );
}
