import { useState } from 'react';
import { EmerCheckedItem } from '@/app/main/EmerChecked/utils/types';
import { ChecklistItemData } from '@/app/main/EmerChecked/component/update/utils/types';
import { getEmerCheckedById } from '@/app/main/EmerChecked/service/serviceEmerChecked';

export function useModals() {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EmerCheckedItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<EmerCheckedItem | null>(null);
  const [updateData, setUpdateData] = useState<{ emerCheckedId: number; item: ChecklistItemData } | null>(null);
  const [printItem, setPrintItem] = useState<EmerCheckedItem | null>(null);
  const [printLoading, setPrintLoading] = useState(false);

  const openViewModal = async (item: EmerCheckedItem) => {
    const result = await getEmerCheckedById(item.id);
    if (result.success && result.data) { setSelectedItem(result.data); setViewModalOpen(true); }
  };
  const closeViewModal = () => { setViewModalOpen(false); setSelectedItem(null); };
  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);
  const openUpdateModal = (emerCheckedId: number, item: ChecklistItemData) => { setUpdateData({ emerCheckedId, item }); setUpdateModalOpen(true); };
  const closeUpdateModal = () => { setUpdateModalOpen(false); setUpdateData(null); };
  const openDeleteModal = (item: EmerCheckedItem) => { setDeleteItem(item); setDeleteModalOpen(true); };
  const closeDeleteModal = () => { setDeleteModalOpen(false); setDeleteItem(null); };
  const openPrint = async (item: EmerCheckedItem) => {
    const result = await getEmerCheckedById(item.id);
    if (result.success && result.data) setPrintItem(result.data);
  };
  const refreshSelectedItem = async () => {
    if (selectedItem) {
      const result = await getEmerCheckedById(selectedItem.id);
      if (result.success && result.data) setSelectedItem(result.data);
    }
  };

  return { viewModalOpen, addModalOpen, updateModalOpen, deleteModalOpen, selectedItem, deleteItem, updateData, printItem, printLoading, setPrintLoading, openViewModal, closeViewModal, openAddModal, closeAddModal, openUpdateModal, closeUpdateModal, openDeleteModal, closeDeleteModal, openPrint, setPrintItem, refreshSelectedItem };
}
