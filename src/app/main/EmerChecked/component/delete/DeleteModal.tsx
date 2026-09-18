'use client';

import { useState } from 'react';
import { Modal } from '@/components/modal/mainModal';
import DeleteForm from '@/app/main/EmerChecked/component/delete/DeleteForm';
import { handleDeleteSubmit } from '@/app/main/EmerChecked/component/delete/utils/submitHandler';
import { EmerCheckedItem } from '@/app/main/EmerChecked/utils/types';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item: EmerCheckedItem | null;
}

export default function DeleteModal({ isOpen, onClose, onSuccess, item }: DeleteModalProps) {
  const [loading, setLoading] = useState(false);

  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ยืนยันการลบข้อมูล" showCloseButton contentClassName="!max-w-lg">
      <DeleteForm item={item} loading={loading} onSubmit={() => handleDeleteSubmit({ emergency_checked_id: item.id }, () => { onSuccess(); onClose(); }, setLoading)} onCancel={onClose} />
    </Modal>
  );
}
