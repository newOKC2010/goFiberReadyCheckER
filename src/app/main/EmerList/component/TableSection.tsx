import Dropdown from '@/components/dropdown/mainDropdown';
import Table from '@/components/table/mainTable';
import Pagination from '@/components/pagination/mainPagination';
import Loading from '@/components/loading/mainLoading';
import { EmerListItem } from '@/app/main/EmerList/utils/types';
import { DropdownOption } from '@/components/dropdown/handler/TYPE';
import { PaginationData } from '@/components/pagination/handler/handlerPagination';
import { formatDate } from '@/app/main/EmerList/handler/handlerEmerList';

interface TableSectionProps {
  data: EmerListItem[];
  loading: boolean;
  totalCount: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  itemsPerPageOptions: DropdownOption[];
  showActions: boolean;
  onItemsPerPageChange: (value: number) => void;
  onPageChange: (page: number) => void;
  onEdit: (item: EmerListItem) => void;
}

export default function TableSection({
  data, loading, totalCount, itemsPerPage, currentPage, totalPages,
  itemsPerPageOptions, showActions, onItemsPerPageChange, onPageChange, onEdit
}: TableSectionProps) {
  if (loading) return <Loading />;

  const columns = [
    {
      key: 'index', label: 'ลำดับ',
      render: (item: EmerListItem) => (
        <span className="font-bold">{(currentPage - 1) * itemsPerPage + data.indexOf(item) + 1}</span>
      )
    },
    { key: 'license_plate_name', label: 'ทะเบียนรถ' },
    {
      key: 'active', label: 'สถานะ',
      render: (item: EmerListItem) => (
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${item.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {item.active ? 'ใช้งาน' : 'ปิดใช้งาน'}
        </span>
      )
    },
    { key: 'created_at', label: 'วันที่สร้าง', render: (item: EmerListItem) => formatDate(item.created_at) },
  ];

  if (showActions) {
    columns.push({
      key: 'actions', label: 'จัดการ',
      render: (item: EmerListItem) => (
        <div className="flex gap-1.5 justify-center">
          <button onClick={() => onEdit(item)} className="p-1 text-blue-600 hover:opacity-70 transition-opacity cursor-pointer" title="แก้ไข">
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'wght' 600" }}>edit</span>
          </button>
        </div>
      )
    });
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">รายการทั้งหมด ({totalCount} รายการ)</h2>
        <Dropdown options={itemsPerPageOptions} value={String(itemsPerPage)} onChange={(val) => onItemsPerPageChange(Number(val))} />
      </div>
      <Table columns={columns} data={data} loading={false} getItemId={(item) => item.id} />
      <Pagination
        paginationData={{ count: itemsPerPage, total_count: totalCount, total_pages: totalPages, current_page: currentPage } as PaginationData}
        onPageChange={onPageChange}
        loading={false}
      />
    </div>
  );
}
