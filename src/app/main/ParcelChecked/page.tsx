'use client';

import PageHeader from '@/app/main/ParcelChecked/component/PageHeader';
import FilterSection from '@/app/main/ParcelChecked/component/FilterSection';
import TableSection from '@/app/main/ParcelChecked/component/TableSection';
import ViewModal from '@/app/main/ParcelChecked/component/ViewModal';
import PrintContent from '@/app/main/ParcelChecked/component/PrintContent';
import PrintLoader from '@/app/main/ParcelChecked/component/PrintLoader';
import AddModal from '@/app/main/ParcelChecked/component/add/AddModal';
import UpdateModal from '@/app/main/ParcelChecked/component/update/UpdateModal';
import DeleteModal from '@/app/main/ParcelChecked/component/delete/DeleteModal';
import { useParcelCheckedData } from '@/app/main/ParcelChecked/hooks/useParcelCheckedData';
import { usePagination } from '@/app/main/ParcelChecked/hooks/usePagination';
import { useModals } from '@/app/main/ParcelChecked/hooks/useModals';
import { usePrintEffect } from '@/app/main/ParcelChecked/hooks/usePrintEffect';
import { handleSearch, handleReset } from '@/app/main/ParcelChecked/utils/searchHandlers';
import * as handler from '@/app/main/ParcelChecked/handler/handlerParcelChecked';

export default function ParcelCheckedPage() {
  const { data, setData, pagination, setPagination, loading, searchLoading, setSearchLoading, filters, setFilters, emergencies, checklists, staff, userRole, reloadData, reloadDropdownData } = useParcelCheckedData();
  const { currentPage, setCurrentPage, itemsPerPage, handleItemsPerPageChange } = usePagination(5);
  const { viewModalOpen, addModalOpen, updateModalOpen, deleteModalOpen, selectedItem, deleteItem, updateData, printItem, printLoading, setPrintLoading, openViewModal, closeViewModal, openAddModal, closeAddModal, openUpdateModal, closeUpdateModal, openDeleteModal, closeDeleteModal, openPrint, setPrintItem, refreshSelectedItem } = useModals();

  usePrintEffect(printItem, setPrintLoading, setPrintItem);

  const handleEditItem = (parcelCheckedId: number, checklistItem: any) => openUpdateModal(parcelCheckedId, checklistItem);

  const handleUpdateSuccess = async () => {
    await reloadData({ ...filters, offset: (currentPage - 1) * itemsPerPage, limit: itemsPerPage });
    await refreshSelectedItem();
  };

  const handleOpenAddModal = async () => { await reloadDropdownData(); openAddModal(); };
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
          <PageHeader onAdd={handleOpenAddModal} showAddButton={true} />

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
          <AddModal isOpen={addModalOpen} onClose={closeAddModal} onSuccess={handleAddSuccess} emergencies={emergencies} checklists={checklists} />

          {updateData && (
            <UpdateModal isOpen={updateModalOpen} onClose={closeUpdateModal} onSuccess={handleUpdateSuccess} parcelCheckedId={updateData.parcelCheckedId} checklistItem={updateData.item} />
          )}

          <DeleteModal isOpen={deleteModalOpen} onClose={closeDeleteModal} onSuccess={handleDeleteSuccess} item={deleteItem} />
        </div>
      </div>

      {printItem && <div className="print-only"><PrintContent item={printItem} /></div>}
      <PrintLoader loading={printLoading} />
    </div>
  );
}
