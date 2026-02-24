import { useState, useEffect } from 'react';
import { CarCheckedItem, CarOption, StaffOption, ChecklistOption, FilterParams, PaginationResponse } from '@/app/main/carChecked/utils/types';
import * as handler from '@/app/main/carChecked/handler/handlerCarChecked';
import * as service from '@/app/main/carChecked/service/serviceCarChecked';

export function useCarCheckedData() {
  const [data, setData] = useState<CarCheckedItem[]>([]);
  const [pagination, setPagination] = useState<PaginationResponse>({ total_count: 0, total_pages: 0, current_page: 0 });
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filters, setFilters] = useState<FilterParams>({});
  const [cars, setCars] = useState<CarOption[]>([]);
  const [staff, setStaff] = useState<StaffOption[]>([]);
  const [checklists, setChecklists] = useState<ChecklistOption[]>([]);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await initData();
      await initialFetchData();
      setLoading(false);
    };
    init();
  }, []);

  const initData = async () => {
    const role = await handler.loadUserRole();
    setUserRole(role);
    
    const carsData = await handler.loadCars();
    setCars(carsData);
    
    const checklistData = await service.loadChecklists();
    setChecklists(checklistData);
    
    if (handler.isAdminOrSuperAdmin(role)) {
      const staffData = await handler.loadStaff();
      setStaff(staffData);
    }
  };

  const initialFetchData = async () => {
    const result = await handler.loadData({ offset: 0, limit: 5 });
    if (result.success) {
      setData(result.data);
      if (result.pagination) setPagination(result.pagination);
    }
  };

  const reloadData = async (currentFilters: FilterParams) => {
    const result = await handler.loadData(currentFilters);
    if (result.success) {
      setData(result.data);
      if (result.pagination) setPagination(result.pagination);
    }
  };

  const reloadDropdownData = async () => {
    const carsData = await handler.loadCars();
    setCars(carsData);
    
    const checklistData = await service.loadChecklists();
    setChecklists(checklistData);
  };

  return {
    data,
    setData,
    pagination,
    setPagination,
    loading,
    searchLoading,
    setSearchLoading,
    filters,
    setFilters,
    cars,
    staff,
    checklists,
    userRole,
    reloadData,
    reloadDropdownData
  };
}
