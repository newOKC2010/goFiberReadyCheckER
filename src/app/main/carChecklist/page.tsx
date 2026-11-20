'use client';

import { useState } from 'react';
import PageHeader from '@/app/main/carChecklist/component/PageHeader';
import TableSection from '@/app/main/carChecklist/component/TableSection';
import AddModal from '@/app/main/carChecklist/component/add/AddModal';
import UpdateModal from '@/app/main/carChecklist/component/update/UpdateModal';
import Dropdown from '@/components/dropdown/mainDropdown';
import { useChecklistData } from '@/app/main/carChecklist/hooks/useChecklistData';
import { usePagination } from '@/app/main/carChecklist/hooks/usePagination';
import { useModals } from '@/app/main/carChecklist/hooks/useModals';
import * as handler from '@/app/main/carChecklist/handler/handlerChecklist';

const ROLE_FILTER_OPTIONS = [
  { value: '',       label: 'ทั้งหมด' },
  { value: 'user',   label: 'ผู้ใช้งาน (user)' },
  { value: 'driver', label: 'คนขับ (driver)' },
];

export default function CarChecklistPage() {
  const { data, pagination, loading, reloadData } = useChecklistData();
  const { currentPage, setCurrentPage, itemsPerPage, handleItemsPerPageChange } = usePagination(5);
  const { addModalOpen, updateModalOpen, selectedItem, openAddModal, closeAddModal, openUpdateModal, closeUpdateModal } = useModals();
  const [roleFilter, setRoleFilter] = useState('');

  const handleSearch = () => {
    setCurrentPage(1);
    reloadData(0, itemsPerPage, roleFilter || undefined);
  };

  const handleClear = () => {
    setRoleFilter('');
    setCurrentPage(1);
    reloadData(0, itemsPerPage);
  };

  const handleSuccess = () => {
    reloadData((currentPage - 1) * itemsPerPage, itemsPerPage, roleFilter || undefined);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    reloadData((page - 1) * itemsPerPage, itemsPerPage, roleFilter || undefined);
  };

  const handleItemsChange = (value: number) => {
    handleItemsPerPageChange(value);
    setCurrentPage(1);
    reloadData(0, value, roleFilter || undefined);
  };

  const itemsPerPageOptions = handler.createItemsPerPageOptions();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <PageHeader
          onAdd={openAddModal}
          showAddButton={true}
        />

        {/* Role filter */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-end gap-4">
          <Dropdown
            options={ROLE_FILTER_OPTIONS}
            value={roleFilter}
            onChange={setRoleFilter}
            label="ใช้กับผู้ใช้ประเภท"
            className="w-64"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'wght' 600" }}>restart_alt</span>
              ล้างการค้นหา
            </button>
            <button
              type="button"
              onClick={handleSearch}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'wght' 600" }}>search</span>
              ค้นหา
            </button>
          </div>
        </div>

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
