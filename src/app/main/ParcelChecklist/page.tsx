'use client';

import PageHeader from '@/app/main/ParcelChecklist/component/PageHeader';
import TableSection from '@/app/main/ParcelChecklist/component/TableSection';
import AddModal from '@/app/main/ParcelChecklist/component/add/AddModal';
import UpdateModal from '@/app/main/ParcelChecklist/component/update/UpdateModal';
import { useParcelChecklistData } from '@/app/main/ParcelChecklist/hooks/useParcelChecklistData';
import { usePagination } from '@/app/main/ParcelChecklist/hooks/usePagination';
import { useModals } from '@/app/main/ParcelChecklist/hooks/useModals';
import { createItemsPerPageOptions } from '@/app/main/ParcelChecklist/handler/handlerParcelChecklist';

export default function ParcelChecklistPage() {
  const { data, pagination, loading, reloadData } = useParcelChecklistData();
  const { currentPage, setCurrentPage, itemsPerPage, handleItemsPerPageChange } = usePagination(5);
  const { addModalOpen, updateModalOpen, selectedItem, openAddModal, closeAddModal, openUpdateModal, closeUpdateModal } = useModals();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    reloadData((page - 1) * itemsPerPage, itemsPerPage);
  };

  const handleItemsChange = (value: number) => {
    handleItemsPerPageChange(value);
    setCurrentPage(1);
    reloadData(0, value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <PageHeader onAdd={openAddModal} showAddButton={true} />
        <TableSection
          data={data}
          loading={loading}
          totalCount={pagination.total_count}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          totalPages={pagination.total_pages}
          itemsPerPageOptions={createItemsPerPageOptions()}
          showActions={true}
          onItemsPerPageChange={handleItemsChange}
          onPageChange={handlePageChange}
          onEdit={openUpdateModal}
        />
        <AddModal isOpen={addModalOpen} onClose={closeAddModal} onSuccess={() => reloadData((currentPage - 1) * itemsPerPage, itemsPerPage)} />
        <UpdateModal isOpen={updateModalOpen} onClose={closeUpdateModal} onSuccess={() => reloadData((currentPage - 1) * itemsPerPage, itemsPerPage)} item={selectedItem} />
      </div>
    </div>
  );
}
