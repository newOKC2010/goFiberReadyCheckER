import { useState, useEffect } from 'react';
import { ParcelListItem, PaginationResponse } from '@/app/main/ParcelList/utils/types';
import { getParcelListData } from '@/app/main/ParcelList/service/serviceParcelList';

export function useParcelListData() {
  const [data, setData] = useState<ParcelListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationResponse>({ total_count: 0, total_pages: 0, current_page: 0 });
  const [loading, setLoading] = useState(true);

  const loadData = async (offset?: number, limit?: number) => {
    setLoading(true);
    const result = await getParcelListData(offset, limit);
    if (result.success) {
      setData(result.data);
      if (result.pagination) setPagination(result.pagination);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(0, 5); }, []);
  return { data, pagination, loading, reloadData: loadData };
}
