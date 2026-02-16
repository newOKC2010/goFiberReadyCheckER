import { useState, useEffect } from 'react';
import { CarCheckedItem, CarOption, StaffOption, ChecklistOption, FilterParams } from '@/app/main/carChecked/utils/types';
import * as handler from '@/app/main/carChecked/handler/handlerCarChecked';
import * as addHandler from '@/app/main/carChecked/handler/handlerAdd';

export function useCarCheckedData() {
  const [data, setData] = useState<CarCheckedItem[]>([]);
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
    
    const checklistData = await addHandler.loadChecklists();
    setChecklists(checklistData);
    
    if (handler.isAdminOrSuperAdmin(role)) {
      const staffData = await handler.loadStaff();
      setStaff(staffData);
    }
  };

  const initialFetchData = async () => {
    const result = await handler.loadData({});
    if (result.success) {
      setData(result.data);
    }
  };

  const reloadData = async (currentFilters: FilterParams) => {
    const result = await handler.loadData(currentFilters);
    if (result.success) {
      setData(result.data);
    }
  };

  return {
    data,
    setData,
    loading,
    searchLoading,
    setSearchLoading,
    filters,
    setFilters,
    cars,
    staff,
    checklists,
    userRole,
    reloadData
  };
}
