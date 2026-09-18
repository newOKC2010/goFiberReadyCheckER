import { useState, useEffect } from 'react';
import { EmerCheckedItem, EmerOption, StaffOption, FilterParams, PaginationResponse } from '@/app/main/EmerChecked/utils/types';
import * as handler from '@/app/main/EmerChecked/handler/handlerEmerChecked';

export function useEmerCheckedData() {
  const [data, setData] = useState<EmerCheckedItem[]>([]);
  const [pagination, setPagination] = useState<PaginationResponse>({ total_count: 0, total_pages: 0, current_page: 0 });
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filters, setFilters] = useState<FilterParams>({});
  const [emergencies, setEmergencies] = useState<EmerOption[]>([]);
  const [staff, setStaff] = useState<StaffOption[]>([]);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const role = await handler.loadUserRole();
      setUserRole(role);
      const emerData = await handler.loadEmergencies();
      setEmergencies(emerData);
      if (handler.isAdminOrSuperAdmin(role)) {
        const staffData = await handler.loadStaff();
        setStaff(staffData);
      }
      const result = await handler.loadData({ offset: 0, limit: 5 });
      if (result.success) { setData(result.data); if (result.pagination) setPagination(result.pagination); }
      setLoading(false);
    };
    init();
  }, []);

  const reloadData = async (currentFilters: FilterParams) => {
    const result = await handler.loadData(currentFilters);
    if (result.success) { setData(result.data); if (result.pagination) setPagination(result.pagination); }
  };

  const reloadDropdownData = async () => {
    const emerData = await handler.loadEmergencies();
    setEmergencies(emerData);
  };

  return { data, setData, pagination, setPagination, loading, searchLoading, setSearchLoading, filters, setFilters, emergencies, staff, userRole, reloadData, reloadDropdownData };
}
