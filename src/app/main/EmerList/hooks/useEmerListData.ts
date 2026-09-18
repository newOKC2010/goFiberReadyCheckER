import { useState, useEffect } from 'react';
import { EmerListItem, PaginationResponse } from '@/app/main/EmerList/utils/types';
import { getEmerListData } from '@/app/main/EmerList/service/serviceEmerList';

export function useEmerListData() {
  const [data, setData] = useState<EmerListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationResponse>({ total_count: 0, total_pages: 0, current_page: 0 });
  const [loading, setLoading] = useState(true);

  const loadData = async (offset?: number, limit?: number) => {
    setLoading(true);
    const result = await getEmerListData(offset, limit);
    if (result.success) {
      setData(result.data);
      if (result.pagination) setPagination(result.pagination);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(0, 5); }, []);

  return { data, pagination, loading, reloadData: loadData };
}
