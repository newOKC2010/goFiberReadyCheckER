import { useState } from 'react';
import { CarItem } from '@/app/main/carList/utils/types';

export function useModals() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CarItem | null>(null);

  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);

  const openUpdateModal = (item: CarItem) => {
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
