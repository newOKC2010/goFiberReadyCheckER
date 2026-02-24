import { useState, useEffect } from 'react';
import { CarItem, PaginationResponse } from '@/app/main/carList/utils/types';
import { getCarListData } from '@/app/main/carList/service/serviceCarList';

export function useCarListData() {
  const [data, setData] = useState<CarItem[]>([]);
  const [pagination, setPagination] = useState<PaginationResponse>({ total_count: 0, total_pages: 0, current_page: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData(0, 5);
  }, []);

  const loadData = async (offset?: number, limit?: number) => {
    setLoading(true);
    const result = await getCarListData(offset, limit);
    if (result.success) {
      setData(result.data);
      if (result.pagination) setPagination(result.pagination);
    }
    setLoading(false);
  };

  const reloadData = (offset?: number, limit?: number) => {
    loadData(offset, limit);
  };

  return { data, pagination, loading, reloadData };
}
