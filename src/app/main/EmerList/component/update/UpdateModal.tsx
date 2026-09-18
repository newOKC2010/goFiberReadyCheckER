'use client';

import { useState } from 'react';
import { Modal } from '@/components/modal/mainModal';
import UpdateForm from '@/app/main/EmerList/component/update/UpdateForm';
import { handleUpdateSubmit } from '@/app/main/EmerList/component/update/utils/submitHandler';
import { EmerListItem } from '@/app/main/EmerList/utils/types';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item: EmerListItem | null;
}

export default function UpdateModal({ isOpen, onClose, onSuccess, item }: UpdateModalProps) {
  const [loading, setLoading] = useState(false);

  if (!item) return null;

  const handleSubmit = (data: Parameters<typeof handleUpdateSubmit>[0]) => {
    handleUpdateSubmit(data, setLoading, () => { onSuccess(); onClose(); });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="แก้ไขทะเบียนรถ Emergency" showCloseButton={!loading}>
      <UpdateForm item={item} loading={loading} onSubmit={handleSubmit} onCancel={onClose} />
    </Modal>
  );
}
