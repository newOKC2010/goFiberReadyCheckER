'use client';

import PageHeader from '@/app/main/carChecked/component/PageHeader';
import FilterSection from '@/app/main/carChecked/component/FilterSection';
import TableSection from '@/app/main/carChecked/component/TableSection';
import ViewModal from '@/app/main/carChecked/component/ViewModal';
import PrintContent from '@/app/main/carChecked/component/PrintContent';
import PrintLoader from '@/app/main/carChecked/component/PrintLoader';
import AddModal from '@/app/main/carChecked/component/add/AddModal';
import UpdateModal from '@/app/main/carChecked/component/update/UpdateModal';
import DeleteModal from '@/app/main/carChecked/component/delete/DeleteModal';
import * as handler from '@/app/main/carChecked/handler/handlerCarChecked';
import { useCarCheckedData } from '@/app/main/carChecked/hooks/useCarCheckedData';
import { usePagination } from '@/app/main/carChecked/hooks/usePagination';
import { useModals } from '@/app/main/carChecked/hooks/useModals';
import { usePrintEffect } from '@/app/main/carChecked/hooks/usePrintEffect';
import { handleSearch, handleReset } from '@/app/main/carChecked/utils/searchHandlers';

export default function CarCheckedPage() {
  const { data, setData, pagination, setPagination, loading, searchLoading, setSearchLoading, filters, setFilters, cars, staff, checklists, userRole, reloadData, reloadDropdownData } = useCarCheckedData();
  const { currentPage, setCurrentPage, itemsPerPage, handleItemsPerPageChange } = usePagination(5);
  const { viewModalOpen, addModalOpen, updateModalOpen, deleteModalOpen, selectedItem, deleteItem, updateData, printItem, printLoading, setPrintLoading, openViewModal, closeViewModal, openAddModal, closeAddModal, openUpdateModal, closeUpdateModal, openDeleteModal, closeDeleteModal, openPrint, setPrintItem, refreshSelectedItem } = useModals();

  usePrintEffect(printItem, setPrintLoading, setPrintItem);

  const handleEditItem = (carCheckedId: number, checklistItem: any) => {
    openUpdateModal(carCheckedId, checklistItem);
  };

  const handleUpdateSuccess = async () => {
    // Reload data จาก backend เพื่ออัพเดท table
    await reloadData({ ...filters, offset: (currentPage - 1) * itemsPerPage, limit: itemsPerPage });
    // Refresh selectedItem เพื่อให้เห็นข้อมูลใหม่ใน modal ทันที
    await refreshSelectedItem();
  };

  const handleOpenAddModal = async () => {
    await reloadDropdownData();
    openAddModal();
  };

  const handleAddSuccess = () => {
    reloadData({ ...filters, offset: (currentPage - 1) * itemsPerPage, limit: itemsPerPage });
  };

  const handleDeleteSuccess = () => {
    reloadData({ ...filters, offset: (currentPage - 1) * itemsPerPage, limit: itemsPerPage });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    reloadData({ ...filters, offset: (page - 1) * itemsPerPage, limit: itemsPerPage });
  };

  const handleItemsChange = (value: number) => {
    handleItemsPerPageChange(value);
    setCurrentPage(1);
    reloadData({ ...filters, offset: 0, limit: value });
  };

  const onSearch = () => handleSearch({ ...filters, offset: 0, limit: itemsPerPage }, setSearchLoading, setData, setPagination, setCurrentPage);
  const onReset = () => handleReset(setFilters, setSearchLoading, setData, setPagination, setCurrentPage);

  const { carOptions, staffOptions, itemsPerPageOptions } = handler.createDropdownOptions(cars, staff);

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { 
            overflow: visible !important; 
            height: auto !important;
            width: auto !important;
          }
          * { 
            overflow: visible !important; 
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
          }
        }
        @media screen {
          .print-only { display: none !important; }
        }
      `}</style>
      
      <div className="no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <PageHeader 
            onAdd={handleOpenAddModal}
            showAddButton={true}
          />
      
          <FilterSection
            filters={filters}
            onFilterChange={setFilters}
            onSearch={onSearch}
            onReset={onReset}
            loading={searchLoading}
            carOptions={carOptions}
            staffOptions={staffOptions}
            showStaffFilter={handler.isAdminOrSuperAdmin(userRole)}
          />
          
          <TableSection
            data={data}
            loading={searchLoading || loading}
            totalCount={pagination.total_count}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            totalPages={pagination.total_pages}
            itemsPerPageOptions={itemsPerPageOptions}
            showStaffColumn={handler.isAdminOrSuperAdmin(userRole)}
            showDeleteButton={handler.isAdminOrSuperAdmin(userRole)}
            showPrintButton={handler.isAdminOrSuperAdmin(userRole)}
            onItemsPerPageChange={handleItemsChange}
            onPageChange={handlePageChange}
            onView={openViewModal}
            onPrint={openPrint}
            onDelete={openDeleteModal}
          />

          <ViewModal
            item={selectedItem}
            isOpen={viewModalOpen}
            onClose={closeViewModal}
            onEditItem={handleEditItem}
          />

          <AddModal
            isOpen={addModalOpen}
            onClose={closeAddModal}
            onSuccess={handleAddSuccess}
            cars={cars}
            checklists={checklists}
          />

          {updateData && (
            <UpdateModal
              isOpen={updateModalOpen}
              onClose={closeUpdateModal}
              onSuccess={handleUpdateSuccess}
              carCheckedId={updateData.carCheckedId}
              checklistItem={updateData.item}
            />
          )}

          <DeleteModal
            isOpen={deleteModalOpen}
            onClose={closeDeleteModal}
            onSuccess={handleDeleteSuccess}
            item={deleteItem}
          />
        </div>
      </div>

      {printItem && (
        <div className="print-only">
          <PrintContent item={printItem} />
        </div>
      )}

      <PrintLoader loading={printLoading} />
    </div>
  );
}