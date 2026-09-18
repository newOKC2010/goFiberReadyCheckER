'use client';

import PageHeader from '@/app/main/EmerChecked/component/PageHeader';
import FilterSection from '@/app/main/EmerChecked/component/FilterSection';
import TableSection from '@/app/main/EmerChecked/component/TableSection';
import ViewModal from '@/app/main/EmerChecked/component/ViewModal';
import PrintContent from '@/app/main/EmerChecked/component/PrintContent';
import PrintLoader from '@/app/main/EmerChecked/component/PrintLoader';
import AddModal from '@/app/main/EmerChecked/component/add/AddModal';
import UpdateModal from '@/app/main/EmerChecked/component/update/UpdateModal';
import DeleteModal from '@/app/main/EmerChecked/component/delete/DeleteModal';
import { useEmerCheckedData } from '@/app/main/EmerChecked/hooks/useEmerCheckedData';
import { usePagination } from '@/app/main/EmerChecked/hooks/usePagination';
import { useModals } from '@/app/main/EmerChecked/hooks/useModals';
import { usePrintEffect } from '@/app/main/EmerChecked/hooks/usePrintEffect';
import { handleSearch, handleReset } from '@/app/main/EmerChecked/utils/searchHandlers';
import * as handler from '@/app/main/EmerChecked/handler/handlerEmerChecked';

export default function EmerCheckedPage() {
  const { data, setData, pagination, setPagination, loading, searchLoading, setSearchLoading, filters, setFilters, emergencies, staff, userRole, reloadData } = useEmerCheckedData();
  const { currentPage, setCurrentPage, itemsPerPage, handleItemsPerPageChange } = usePagination(5);
  const { viewModalOpen, addModalOpen, updateModalOpen, deleteModalOpen, selectedItem, deleteItem, updateData, printItem, printLoading, setPrintLoading, openViewModal, closeViewModal, openAddModal, closeAddModal, openUpdateModal, closeUpdateModal, openDeleteModal, closeDeleteModal, openPrint, setPrintItem, refreshSelectedItem } = useModals();

  usePrintEffect(printItem, setPrintLoading, setPrintItem);

  const handleEditItem = (emerCheckedId: number, checklistItem: any) => openUpdateModal(emerCheckedId, checklistItem);

  const handleUpdateSuccess = async () => {
    await reloadData({ ...filters, offset: (currentPage - 1) * itemsPerPage, limit: itemsPerPage });
    await refreshSelectedItem();
  };

  const handleAddSuccess = () => reloadData({ ...filters, offset: (currentPage - 1) * itemsPerPage, limit: itemsPerPage });
  const handleDeleteSuccess = () => reloadData({ ...filters, offset: (currentPage - 1) * itemsPerPage, limit: itemsPerPage });

  const handlePageChange = (page: number) => { setCurrentPage(page); reloadData({ ...filters, offset: (page - 1) * itemsPerPage, limit: itemsPerPage }); };
  const handleItemsChange = (value: number) => { handleItemsPerPageChange(value); setCurrentPage(1); reloadData({ ...filters, offset: 0, limit: value }); };

  const onSearch = () => handleSearch({ ...filters, offset: 0, limit: itemsPerPage }, setSearchLoading, setData, setPagination, setCurrentPage);
  const onReset = () => handleReset(setFilters, setSearchLoading, setData, setPagination, setCurrentPage);

  const { emerOptions, staffOptions, itemsPerPageOptions } = handler.createDropdownOptions(emergencies, staff);

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @media print { .no-print { display: none !important; } .print-only { display: block !important; } body, * { overflow: visible !important; height: auto !important; width: auto !important; } html, body { margin: 0 !important; padding: 0 !important; } }
        @media screen { .print-only { display: none !important; } }
      `}</style>

      <div className="no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <PageHeader onAdd={openAddModal} showAddButton={true} />

          <FilterSection
            filters={filters} onFilterChange={setFilters} onSearch={onSearch} onReset={onReset}
            loading={searchLoading} emerOptions={emerOptions} staffOptions={staffOptions}
            showStaffFilter={handler.isAdminOrSuperAdmin(userRole)}
          />

          <TableSection
            data={data} loading={searchLoading || loading} totalCount={pagination.total_count}
            itemsPerPage={itemsPerPage} currentPage={currentPage} totalPages={pagination.total_pages}
            itemsPerPageOptions={itemsPerPageOptions} showStaffColumn={handler.isAdminOrSuperAdmin(userRole)}
            showDeleteButton={handler.isAdminOrSuperAdmin(userRole)} showPrintButton={handler.isAdminOrSuperAdmin(userRole)}
            onItemsPerPageChange={handleItemsChange} onPageChange={handlePageChange}
            onView={openViewModal} onPrint={openPrint} onDelete={openDeleteModal}
          />

          <ViewModal item={selectedItem} isOpen={viewModalOpen} onClose={closeViewModal} onEditItem={handleEditItem} />
          <AddModal isOpen={addModalOpen} onClose={closeAddModal} />

          {updateData && (
            <UpdateModal isOpen={updateModalOpen} onClose={closeUpdateModal} onSuccess={handleUpdateSuccess} emerCheckedId={updateData.emerCheckedId} checklistItem={updateData.item} />
          )}

          <DeleteModal isOpen={deleteModalOpen} onClose={closeDeleteModal} onSuccess={handleDeleteSuccess} item={deleteItem} />
        </div>
      </div>

      {printItem && <div className="print-only"><PrintContent item={printItem} /></div>}
      <PrintLoader loading={printLoading} />
    </div>
  );
}
