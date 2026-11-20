import Dropdown from '@/components/dropdown/mainDropdown';
import Table from '@/components/table/mainTable';
import Pagination from '@/components/pagination/mainPagination';
import Loading from '@/components/loading/mainLoading';
import { UserItem } from '@/app/main/UserManage/utils/types';
import { DropdownOption } from '@/components/dropdown/handler/TYPE';
import { PaginationData } from '@/components/pagination/handler/handlerPagination';
import { getRoleLabel, getRoleBadgeClass } from '@/app/main/UserManage/handler/handlerUserManage';

interface TableSectionProps {
  data: UserItem[];
  loading: boolean;
  totalCount: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  itemsPerPageOptions: DropdownOption[];
  onItemsPerPageChange: (value: number) => void;
  onPageChange: (page: number) => void;
  onEdit: (item: UserItem) => void;
}

export default function TableSection({
  data,
  loading,
  totalCount,
  itemsPerPage,
  currentPage,
  totalPages,
  itemsPerPageOptions,
  onItemsPerPageChange,
  onPageChange,
  onEdit
}: TableSectionProps) {
  if (loading) return <Loading />;

  const columns = [
    {
      key: 'index',
      label: 'ลำดับ',
      render: (item: UserItem) => (
        <span className="font-bold">{(currentPage - 1) * itemsPerPage + data.indexOf(item) + 1}</span>
      )
    },
    { key: 'full_name', label: 'ชื่อ-นามสกุล' },
    { key: 'email', label: 'อีเมล' },
    {
      key: 'role',
      label: 'Role',
      render: (item: UserItem) => (
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRoleBadgeClass(item.role)}`}>
          {getRoleLabel(item.role)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'สถานะ',
      render: (item: UserItem) => (
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${item.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {item.status ? 'ใช้งาน' : 'รอการอนุมัติ / ระงับ'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'จัดการ',
      render: (item: UserItem) => (
        <button
          onClick={() => onEdit(item)}
          className="p-1 text-blue-600 hover:opacity-70 transition-opacity cursor-pointer"
          title="แก้ไข"
        >
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'wght' 600" }}>edit</span>
        </button>
      )
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">รายการทั้งหมด ({totalCount} รายการ)</h2>
        <Dropdown
          options={itemsPerPageOptions}
          value={String(itemsPerPage)}
          onChange={(val) => onItemsPerPageChange(Number(val))}
        />
      </div>

      <Table columns={columns} data={data} loading={false} getItemId={(item) => item.id} />

      <Pagination
        paginationData={{
          count: itemsPerPage,
          total_count: totalCount,
          total_pages: totalPages,
          current_page: currentPage
        } as PaginationData}
        onPageChange={onPageChange}
        loading={false}
      />
    </div>
  );
}
