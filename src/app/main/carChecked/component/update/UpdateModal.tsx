'use client';

import { useState } from 'react';
import { Modal } from '@/components/modal/mainModal';
import UpdateForm from '@/app/main/carChecked/component/update/UpdateForm';
import { UpdateModalProps } from '@/app/main/carChecked/component/update/utils/types';

export default function UpdateModal({
  isOpen,
  onClose,
  onSuccess,
  carCheckedId,
  checklistItem
}: UpdateModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="แก้ไขรายการตรวจสอบ"
      showCloseButton={true}
      contentClassName="!max-w-3xl !max-h-[90vh] !overflow-y-auto"
    >
      <UpdateForm
        carCheckedId={carCheckedId}
        checklistItem={checklistItem}
        loading={loading}
        setLoading={setLoading}
        onSuccess={handleSuccess}
        onCancel={onClose}
      />
    </Modal>
  );
}
