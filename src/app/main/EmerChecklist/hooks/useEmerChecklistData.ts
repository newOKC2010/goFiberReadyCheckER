import { useState, useEffect } from 'react';
import { EmerChecklistItem, PaginationResponse } from '@/app/main/EmerChecklist/utils/types';
import { getEmerChecklistData } from '@/app/main/EmerChecklist/service/serviceEmerChecklist';

export function useEmerChecklistData() {
  const [data, setData] = useState<EmerChecklistItem[]>([]);
  const [pagination, setPagination] = useState<PaginationResponse>({ total_count: 0, total_pages: 0, current_page: 0 });
  const [loading, setLoading] = useState(true);

  const loadData = async (offset?: number, limit?: number) => {
    setLoading(true);
    const result = await getEmerChecklistData(offset, limit);
    if (result.success) {
      setData(result.data);
      if (result.pagination) setPagination(result.pagination);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(0, 5); }, []);

  return { data, pagination, loading, reloadData: loadData };
}
