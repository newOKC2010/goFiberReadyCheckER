import Dropdown from '@/components/dropdown/mainDropdown';
import HeaderFiltersDateRange from '@/components/dataPicker/headerFiltersDateRange';
import { FilterParams } from '@/app/main/carChecked/utils/types';
import { DropdownOption } from '@/components/dropdown/handler/TYPE';

interface FilterSectionProps {
  filters: FilterParams;
  onFilterChange: (filters: FilterParams) => void;
  onSearch: () => void;
  onReset: () => void;
  loading: boolean;
  carOptions: DropdownOption[];
  staffOptions: DropdownOption[];
  showStaffFilter: boolean;
}

export default function FilterSection({ filters, onFilterChange, onSearch, onReset, loading, carOptions, staffOptions, showStaffFilter }: FilterSectionProps) {
  return (
    <div className="max-w-4xl mx-auto">
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-visible relative z-10">
      {/* ส่วนบน: ช่วงวันที่ */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 sm:p-6 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-red-500 text-2xl" style={{ fontVariationSettings: "'wght' 700" }}>
            date_range
          </span>
          <h3 className="text-lg font-bold text-gray-800">เลือกช่วงวันที่</h3>
        </div>
        
        <HeaderFiltersDateRange
          startDate={filters.date_from || ''}
          endDate={filters.date_to}
          onStartDateChange={(date) => onFilterChange({ ...filters, date_from: date })}
          onEndDateChange={(date) => onFilterChange({ ...filters, date_to: date })}
        />
      </div>

      {/* ส่วนล่าง: ตัวกรองเพิ่มเติม */}
      <div className="p-4 sm:p-6 space-y-4 relative z-20">
        <div className="flex items-center gap-2 mb-2 sm:mb-4">
          <span className="material-symbols-outlined text-red-500 text-2xl" style={{ fontVariationSettings: "'wght' 700" }}>
            filter_alt
          </span>
          <h3 className="text-lg font-bold text-gray-800">กรองเพิ่มเติม</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          <Dropdown
            label="รายการรถ"
            icon="local_shipping"
            options={carOptions}
            value={filters.car_id || ''}
            onChange={(val) => onFilterChange({ ...filters, car_id: val })}
            searchable
          />
          {showStaffFilter && (
            <Dropdown
              label="เจ้าหน้าที่"
              icon="person"
              options={staffOptions}
              value={filters.staff_id || ''}
              onChange={(val) => onFilterChange({ ...filters, staff_id: val })}
              searchable
            />
          )}
        </div>

        {/* ปุ่มค้นหาและล้าง */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:pt-4 justify-center sm:justify-start">
          <button
            onClick={onSearch}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 
                     text-white font-bold rounded-lg hover:from-red-600 hover:to-red-700 
                     transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 
                     shadow-lg hover:shadow-xl w-full sm:w-auto sm:min-w-[110px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'wght' 700" }}>
              search
            </span>
            <span>ค้นหา</span>
          </button>
          
          <button
            onClick={onReset}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 
                     font-bold rounded-lg hover:bg-gray-200 transition-all duration-200 w-full sm:w-auto sm:min-w-[90px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'wght' 700" }}>
              refresh
            </span>
            <span>ล้าง</span>
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
