import Dropdown from '@/components/dropdown/mainDropdown';
import Table from '@/components/table/mainTable';
import Pagination from '@/components/pagination/mainPagination';
import ActionButtons from '@/app/main/carChecked/component/ActionButtons';
import { CarCheckedItem } from '@/app/main/carChecked/utils/types';
import { DropdownOption } from '@/components/dropdown/handler/TYPE';
import { PaginationData } from '@/components/pagination/handler/handlerPagination';

interface TableSectionProps {
  data: CarCheckedItem[];
  loading: boolean;
  totalCount: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  itemsPerPageOptions: DropdownOption[];
  showStaffColumn: boolean;
  showDeleteButton: boolean;
  showPrintButton: boolean;
  onItemsPerPageChange: (value: number) => void;
  onPageChange: (page: number) => void;
  onView: (item: CarCheckedItem) => void;
  onPrint: (item: CarCheckedItem) => void;
  onEdit: (item: CarCheckedItem) => void;
  onDelete: (item: CarCheckedItem) => void;
}

export default function TableSection({
  data,
  loading,
  totalCount,
  itemsPerPage,
  currentPage,
  totalPages,
  itemsPerPageOptions,
  showStaffColumn,
  showDeleteButton,
  showPrintButton,
  onItemsPerPageChange,
  onPageChange,
  onView,
  onPrint,
  onEdit,
  onDelete
}: TableSectionProps) {
  const columns = [
    { key: 'license_plate_name', label: 'ชื่อรถ' },
    { key: 'checked_date', label: 'วันที่ตรวจสอบ' },
    ...(showStaffColumn ? [{ key: 'checked_by', label: 'ผู้ตรวจสอบ' }] : []),
    { 
      key: 'actions', 
      label: 'จัดการ',
      render: (item: CarCheckedItem) => (
        <ActionButtons
          item={item}
          showDelete={showDeleteButton}
          showPrint={showPrintButton}
          onView={onView}
          onPrint={onPrint}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )
    }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">รายการตรวจสอบ ({totalCount} รายการ)</h2>
        <Dropdown
          options={itemsPerPageOptions}
          value={String(itemsPerPage)}
          onChange={(val) => onItemsPerPageChange(Number(val))}
        />
      </div>

      <Table
        columns={columns}
        data={data}
        loading={loading}
        getItemId={(item) => item.id}
      />

      <Pagination
        paginationData={{
          count: itemsPerPage,
          total_count: totalCount,
          total_pages: totalPages,
          current_page: currentPage
        } as PaginationData}
        onPageChange={onPageChange}
        loading={loading}
      />
    </div>
  );
}
