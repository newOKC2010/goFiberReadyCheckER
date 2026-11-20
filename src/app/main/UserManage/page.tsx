'use client';

import { useState } from 'react';
import PageHeader from '@/app/main/UserManage/component/PageHeader';
import FilterSection from '@/app/main/UserManage/component/FilterSection';
import TableSection from '@/app/main/UserManage/component/TableSection';
import UpdateModal from '@/app/main/UserManage/component/update/UpdateModal';
import { useUserManageData } from '@/app/main/UserManage/hooks/useUserManageData';
import { usePagination } from '@/app/main/UserManage/hooks/usePagination';
import { useModals } from '@/app/main/UserManage/hooks/useModals';
import { createItemsPerPageOptions } from '@/app/main/UserManage/handler/handlerUserManage';
import { UserFilter } from '@/app/main/UserManage/service/serviceUserManage';
import { checkAuth } from '@/global/globalAuth';
import { useEffect } from 'react';

export default function UserManagePage() {
  const { data, pagination, loading, reloadData } = useUserManageData();
  const { currentPage, setCurrentPage, itemsPerPage, handleItemsPerPageChange } = usePagination(5);
  const { updateModalOpen, selectedItem, openUpdateModal, closeUpdateModal } = useModals();
  const [callerRole, setCallerRole] = useState('admin');
  const [activeFilter, setActiveFilter] = useState<UserFilter>({});

  useEffect(() => {
    checkAuth().then(res => { if (res.user?.role) setCallerRole(res.user.role); });
  }, []);

  const handleSearch = (filter: UserFilter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
    reloadData(0, itemsPerPage, filter);
  };

  const handleSuccess = () => reloadData((currentPage - 1) * itemsPerPage, itemsPerPage, activeFilter);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    reloadData((page - 1) * itemsPerPage, itemsPerPage, activeFilter);
  };

  const handleItemsChange = (value: number) => {
    handleItemsPerPageChange(value);
    reloadData(0, value, activeFilter);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <PageHeader />
        <FilterSection callerRole={callerRole} onSearch={handleSearch} />
        <TableSection
          data={data}
          loading={loading}
          totalCount={pagination.total_count}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          totalPages={pagination.total_pages}
          itemsPerPageOptions={createItemsPerPageOptions()}
          onItemsPerPageChange={handleItemsChange}
          onPageChange={handlePageChange}
          onEdit={openUpdateModal}
        />
        <UpdateModal
          isOpen={updateModalOpen}
          onClose={closeUpdateModal}
          onSuccess={handleSuccess}
          item={selectedItem}
        />
      </div>
    </div>
  );
}
