import { useState } from 'react';
import { CarCheckedItem } from '@/app/main/carChecked/utils/types';

export function useModals() {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CarCheckedItem | null>(null);
  const [printItem, setPrintItem] = useState<CarCheckedItem | null>(null);
  const [printLoading, setPrintLoading] = useState(false);

  const openViewModal = (item: CarCheckedItem) => {
    setSelectedItem(item);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedItem(null);
  };

  const openAddModal = () => {
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const openPrint = (item: CarCheckedItem) => {
    setPrintItem(item);
  };

  return {
    viewModalOpen,
    addModalOpen,
    selectedItem,
    printItem,
    printLoading,
    setPrintLoading,
    openViewModal,
    closeViewModal,
    openAddModal,
    closeAddModal,
    openPrint,
    setPrintItem
  };
}
