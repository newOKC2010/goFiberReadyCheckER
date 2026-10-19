import { useState } from 'react';
import { ParcelCheckedItem } from '@/app/main/ParcelChecked/utils/types';
import { ChecklistItemData } from '@/app/main/ParcelChecked/component/update/utils/types';
import { getParcelCheckedById } from '@/app/main/ParcelChecked/service/serviceParcelChecked';

export function useModals() {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ParcelCheckedItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<ParcelCheckedItem | null>(null);
  const [updateData, setUpdateData] = useState<{ parcelCheckedId: number; item: ChecklistItemData } | null>(null);
  const [printItem, setPrintItem] = useState<ParcelCheckedItem | null>(null);
  const [printLoading, setPrintLoading] = useState(false);

  const openViewModal = async (item: ParcelCheckedItem) => {
    const result = await getParcelCheckedById(item.id);
    if (result.success && result.data) { setSelectedItem(result.data); setViewModalOpen(true); }
  };
  const closeViewModal = () => { setViewModalOpen(false); setSelectedItem(null); };
  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);
  const openUpdateModal = (parcelCheckedId: number, item: ChecklistItemData) => { setUpdateData({ parcelCheckedId, item }); setUpdateModalOpen(true); };
  const closeUpdateModal = () => { setUpdateModalOpen(false); setUpdateData(null); };
  const openDeleteModal = (item: ParcelCheckedItem) => { setDeleteItem(item); setDeleteModalOpen(true); };
  const closeDeleteModal = () => { setDeleteModalOpen(false); setDeleteItem(null); };
  const openPrint = async (item: ParcelCheckedItem) => {
    const result = await getParcelCheckedById(item.id);
    if (result.success && result.data) setPrintItem(result.data);
  };
  const refreshSelectedItem = async () => {
    if (selectedItem) {
      const result = await getParcelCheckedById(selectedItem.id);
      if (result.success && result.data) setSelectedItem(result.data);
    }
  };

  return { viewModalOpen, addModalOpen, updateModalOpen, deleteModalOpen, selectedItem, deleteItem, updateData, printItem, printLoading, setPrintLoading, openViewModal, closeViewModal, openAddModal, closeAddModal, openUpdateModal, closeUpdateModal, openDeleteModal, closeDeleteModal, openPrint, setPrintItem, refreshSelectedItem };
}
