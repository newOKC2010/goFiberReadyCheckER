'use client';

import { useState } from 'react';
import { Modal } from '@/components/modal/mainModal';
import UpdateForm from './UpdateForm';
import { handleUpdateSubmit } from './utils/submitHandler';
import { ParcelListItem } from '@/app/main/ParcelList/utils/types';

interface UpdateModalProps { isOpen: boolean; onClose: () => void; onSuccess: () => void; item: ParcelListItem | null; }

export default function UpdateModal({ isOpen, onClose, onSuccess, item }: UpdateModalProps) {
  const [loading, setLoading] = useState(false);
  if (!item) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="แก้ไขพัสดุ" showCloseButton={!loading}>
      <UpdateForm item={item} loading={loading} onSubmit={(data) => handleUpdateSubmit(data, setLoading, () => { onSuccess(); onClose(); })} onCancel={onClose} />
    </Modal>
  );
}
