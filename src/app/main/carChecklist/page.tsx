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
  const { data, loading, reloadData } = useChecklistData();
  const { currentPage, setCurrentPage, itemsPerPage, handleItemsPerPageChange } = usePagination(5);
  const { addModalOpen, updateModalOpen, selectedItem, openAddModal, closeAddModal, openUpdateModal, closeUpdateModal } = useModals();

  const handleSuccess = () => {
    reloadData();
  };

  const { paginatedData, totalPages } = handler.paginateData(data, currentPage, itemsPerPage);
  const itemsPerPageOptions = handler.createItemsPerPageOptions();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <PageHeader 
          onAdd={openAddModal}
          showAddButton={true}
        />

        <TableSection
          data={paginatedData}
          loading={loading}
          totalCount={data.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPageOptions={itemsPerPageOptions}
          showActions={true}
          onItemsPerPageChange={handleItemsPerPageChange}
          onPageChange={setCurrentPage}
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