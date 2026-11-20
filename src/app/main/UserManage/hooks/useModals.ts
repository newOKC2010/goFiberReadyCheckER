import { useState } from 'react';
import { UserItem } from '@/app/main/UserManage/utils/types';

export function useModals() {
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<UserItem | null>(null);

  const openUpdateModal = (item: UserItem) => { setSelectedItem(item); setUpdateModalOpen(true); };
  const closeUpdateModal = () => { setUpdateModalOpen(false); setSelectedItem(null); };

  return { updateModalOpen, selectedItem, openUpdateModal, closeUpdateModal };
}
