'use client';

import { useState } from 'react';
import { Modal } from '@/components/modal/mainModal';
import UpdateForm from '@/app/main/EmerChecked/component/update/UpdateForm';
import { UpdateModalProps } from '@/app/main/EmerChecked/component/update/utils/types';

export default function UpdateModal({ isOpen, onClose, onSuccess, emerCheckedId, checklistItem }: UpdateModalProps) {
  const [loading, setLoading] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="แก้ไขรายการตรวจสอบ" showCloseButton contentClassName="!max-w-3xl !max-h-[90vh] !overflow-y-auto">
      <UpdateForm emerCheckedId={emerCheckedId} checklistItem={checklistItem} loading={loading} setLoading={setLoading} onSuccess={() => { onSuccess(); onClose(); }} onCancel={onClose} />
    </Modal>
  );
}
