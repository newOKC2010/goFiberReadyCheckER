import { useState, useEffect } from 'react';
import { DashboardData } from '@/app/main/dashboard/utils/types';
import { getDashboardData } from '@/app/main/dashboard/service/serviceDashboard';

const defaultData: DashboardData = {
  success: false,
  message: '',
  fleet_readiness: [],
  top_failing_items: [],
  unchecked_cars: [],
  checker_summary: [],
};

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const result = await getDashboardData();
    if (result.success) setData(result);
    setLoading(false);
  };

  return { data, loading, reload: loadData };
}
