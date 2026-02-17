import { useState } from 'react';
import { CarCheckedItem } from '@/app/main/carChecked/utils/types';
import { ChecklistItemData } from '@/app/main/carChecked/component/update/utils/types';
import { getCarCheckedById } from '@/app/main/carChecked/service/serviceCarChecked';

export function useModals() {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CarCheckedItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<CarCheckedItem | null>(null);
  const [updateData, setUpdateData] = useState<{ carCheckedId: number; item: ChecklistItemData } | null>(null);
  const [printItem, setPrintItem] = useState<CarCheckedItem | null>(null);
  const [printLoading, setPrintLoading] = useState(false);

  const openViewModal = async (item: CarCheckedItem) => {
    // Fetch ข้อมูลใหม่จาก backend ทุกครั้ง เพื่อให้ทุกคนเห็นข้อมูลล่าสุด
    const result = await getCarCheckedById(item.id);
    if (result.success && result.data) {
      setSelectedItem(result.data);
      setViewModalOpen(true);
    }
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

  const openUpdateModal = (carCheckedId: number, checklistItem: ChecklistItemData) => {
    setUpdateData({ carCheckedId, item: checklistItem });
    setUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
    setUpdateData(null);
  };

  const openPrint = async (item: CarCheckedItem) => {
    // Fetch ข้อมูลใหม่จาก backend ทุกครั้ง เพื่อให้ print ข้อมูลล่าสุด
    const result = await getCarCheckedById(item.id);
    if (result.success && result.data) {
      setPrintItem(result.data);
    }
  };

  const openDeleteModal = (item: CarCheckedItem) => {
    setDeleteItem(item);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteItem(null);
  };

  const refreshSelectedItem = async () => {
    if (selectedItem) {
      const result = await getCarCheckedById(selectedItem.id);
      if (result.success && result.data) {
        setSelectedItem(result.data);
      }
    }
  };

  return {
    viewModalOpen,
    addModalOpen,
    updateModalOpen,
    deleteModalOpen,
    selectedItem,
    deleteItem,
    updateData,
    printItem,
    printLoading,
    setPrintLoading,
    openViewModal,
    closeViewModal,
    openAddModal,
    closeAddModal,
    openUpdateModal,
    closeUpdateModal,
    openDeleteModal,
    closeDeleteModal,
    openPrint,
    setPrintItem,
    refreshSelectedItem
  };
}
