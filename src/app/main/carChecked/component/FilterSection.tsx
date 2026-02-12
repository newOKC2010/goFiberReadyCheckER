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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 overflow-visible relative z-10">
      <div className="flex flex-col lg:flex-row lg:items-end gap-4 relative">
        <div className="flex-[3]">
          <HeaderFiltersDateRange
            startDate={filters.date_from || ''}
            endDate={filters.date_to}
            onStartDateChange={(date) => onFilterChange({ ...filters, date_from: date })}
            onEndDateChange={(date) => onFilterChange({ ...filters, date_to: date })}
          />
        </div>

        <div className="flex-1">
          <Dropdown
            label="รายการรถ"
            icon="local_shipping"
            options={carOptions}
            value={filters.car_id || ''}
            onChange={(val) => onFilterChange({ ...filters, car_id: val })}
            searchable
          />
        </div>

        {showStaffFilter && (
          <div className="flex-1">
            <Dropdown
              label="เจ้าหน้าที่"
              icon="person"
              options={staffOptions}
              value={filters.staff_id || ''}
              onChange={(val) => onFilterChange({ ...filters, staff_id: val })}
              searchable
            />
          </div>
        )}

        <div className="flex gap-2 lg:flex-none">
          <button
            onClick={onSearch}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 
                     text-white font-bold rounded-lg hover:from-red-600 hover:to-red-700 
                     transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 
                     shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex-1 lg:flex-none"
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
                     font-bold rounded-lg hover:bg-gray-200 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex-1 lg:flex-none"
          >
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'wght' 700" }}>
              refresh
            </span>
            <span>ล้าง</span>
          </button>
        </div>
      </div>
    </div>
  );
}
