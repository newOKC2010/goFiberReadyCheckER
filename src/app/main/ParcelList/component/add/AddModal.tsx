'use client';

import { useState } from 'react';
import { Modal } from '@/components/modal/mainModal';
import AddForm from './AddForm';
import { handleAddSubmit } from './utils/submitHandler';

interface AddModalProps { isOpen: boolean; onClose: () => void; onSuccess: () => void; }

export default function AddModal({ isOpen, onClose, onSuccess }: AddModalProps) {
  const [loading, setLoading] = useState(false);
  const handleSuccess = () => { onSuccess(); onClose(); };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="เพิ่มพัสดุ" showCloseButton={!loading}>
      <AddForm loading={loading} onSubmit={(data) => handleAddSubmit(data, setLoading, handleSuccess)} onCancel={onClose} />
    </Modal>
  );
}
