import { useState, useEffect } from 'react';
import { ParcelChecklistItem, PaginationResponse } from '@/app/main/ParcelChecklist/utils/types';
import { getParcelChecklistData } from '@/app/main/ParcelChecklist/service/serviceParcelChecklist';

export function useParcelChecklistData() {
  const [data, setData] = useState<ParcelChecklistItem[]>([]);
  const [pagination, setPagination] = useState<PaginationResponse>({ total_count: 0, total_pages: 0, current_page: 0 });
  const [loading, setLoading] = useState(true);

  const loadData = async (offset?: number, limit?: number) => {
    setLoading(true);
    const result = await getParcelChecklistData(offset, limit);
    if (result.success) {
      setData(result.data);
      if (result.pagination) setPagination(result.pagination);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(0, 5); }, []);

  return { data, pagination, loading, reloadData: loadData };
}
