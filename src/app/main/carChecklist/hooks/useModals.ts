import { useState } from 'react';
import { ChecklistItem } from '@/app/main/carChecklist/utils/types';

export function useModals() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null);

  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);

  const openUpdateModal = (item: ChecklistItem) => {
    setSelectedItem(item);
    setUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
    setSelectedItem(null);
  };

  return {
    addModalOpen,
    updateModalOpen,
    selectedItem,
    openAddModal,
    closeAddModal,
    openUpdateModal,
    closeUpdateModal
  };
}
