'use client';

import { UserItem } from '@/app/main/UserManage/utils/types';
import UpdateForm from './UpdateForm';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item: UserItem | null;
}

export default function UpdateModal({ isOpen, onClose, onSuccess, item }: UpdateModalProps) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">แก้ไขสถานะผู้ใช้งาน</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-5">
          <UpdateForm item={item} onSuccess={onSuccess} onClose={onClose} />
        </div>
      </div>
    </div>
  );
}
