import { useState } from 'react';
import { EmerChecklistItem } from '@/app/main/EmerChecklist/utils/types';

export function useModals() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EmerChecklistItem | null>(null);

  const openUpdateModal = (item: EmerChecklistItem) => {
    setSelectedItem(item);
    setUpdateModalOpen(true);
  };
  const closeUpdateModal = () => { setUpdateModalOpen(false); setSelectedItem(null); };

  return {
    addModalOpen,
    updateModalOpen,
    selectedItem,
    openAddModal: () => setAddModalOpen(true),
    closeAddModal: () => setAddModalOpen(false),
    openUpdateModal,
    closeUpdateModal
  };
}
