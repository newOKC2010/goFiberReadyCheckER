import { useState } from 'react';
import { EmerListItem } from '@/app/main/EmerList/utils/types';

export function useModals() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EmerListItem | null>(null);

  const openUpdateModal = (item: EmerListItem) => { setSelectedItem(item); setUpdateModalOpen(true); };
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
