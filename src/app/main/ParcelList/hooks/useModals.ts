import { useState } from 'react';
import { ParcelListItem } from '@/app/main/ParcelList/utils/types';

export function useModals() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ParcelListItem | null>(null);

  const openUpdateModal = (item: ParcelListItem) => { setSelectedItem(item); setUpdateModalOpen(true); };
  const closeUpdateModal = () => { setUpdateModalOpen(false); setSelectedItem(null); };

  return { addModalOpen, updateModalOpen, selectedItem, openAddModal: () => setAddModalOpen(true), closeAddModal: () => setAddModalOpen(false), openUpdateModal, closeUpdateModal };
}
