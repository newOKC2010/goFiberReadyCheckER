'use client';

import { useState } from 'react';
import { Modal } from '@/components/modal/mainModal';
import DeleteForm from '@/app/main/ParcelChecked/component/delete/DeleteForm';
import { handleDeleteSubmit } from '@/app/main/ParcelChecked/component/delete/utils/submitHandler';
import { ParcelCheckedItem } from '@/app/main/ParcelChecked/utils/types';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item: ParcelCheckedItem | null;
}

export default function DeleteModal({ isOpen, onClose, onSuccess, item }: DeleteModalProps) {
  const [loading, setLoading] = useState(false);

  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ยืนยันการลบข้อมูล" showCloseButton contentClassName="!max-w-lg">
      <DeleteForm item={item} loading={loading} onSubmit={() => handleDeleteSubmit({ parcel_checked_id: item.id }, () => { onSuccess(); onClose(); }, setLoading)} onCancel={onClose} />
    </Modal>
  );
}
