'use client';

import PageHeader from '@/app/main/carChecklist/component/PageHeader';
import TableSection from '@/app/main/carChecklist/component/TableSection';
import AddModal from '@/app/main/carChecklist/component/add/AddModal';
import UpdateModal from '@/app/main/carChecklist/component/update/UpdateModal';
import { useChecklistData } from '@/app/main/carChecklist/hooks/useChecklistData';
import { usePagination } from '@/app/main/carChecklist/hooks/usePagination';
import { useModals } from '@/app/main/carChecklist/hooks/useModals';
import * as handler from '@/app/main/carChecklist/handler/handlerChecklist';

export default function CarChecklistPage() {
  const { data, pagination, loading, reloadData } = useChecklistData();
  const { currentPage, setCurrentPage, itemsPerPage, handleItemsPerPageChange } = usePagination(5);
  const { addModalOpen, updateModalOpen, selectedItem, openAddModal, closeAddModal, openUpdateModal, closeUpdateModal } = useModals();

  const handleSuccess = () => {
    reloadData((currentPage - 1) * itemsPerPage, itemsPerPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    reloadData((page - 1) * itemsPerPage, itemsPerPage);
  };

  const handleItemsChange = (value: number) => {
    handleItemsPerPageChange(value);
    setCurrentPage(1);
    reloadData(0, value);
  };

  const itemsPerPageOptions = handler.createItemsPerPageOptions();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <PageHeader 
          onAdd={openAddModal}
          showAddButton={true}
        />

        <TableSection
          data={data}
          loading={loading}
          totalCount={pagination.total_count}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          totalPages={pagination.total_pages}
          itemsPerPageOptions={itemsPerPageOptions}
          showActions={true}
          onItemsPerPageChange={handleItemsChange}
          onPageChange={handlePageChange}
          onEdit={openUpdateModal}
        />

        <AddModal
          isOpen={addModalOpen}
          onClose={closeAddModal}
          onSuccess={handleSuccess}
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