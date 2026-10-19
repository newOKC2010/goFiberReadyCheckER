import { useState } from 'react';
import { ParcelChecklistItem } from '@/app/main/ParcelChecklist/utils/types';

export function useModals() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ParcelChecklistItem | null>(null);

  const openUpdateModal = (item: ParcelChecklistItem) => {
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
