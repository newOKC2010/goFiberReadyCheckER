import { useState, useEffect } from 'react';
import { ChecklistItem, PaginationResponse } from '@/app/main/carChecklist/utils/types';
import { getChecklistData } from '@/app/main/carChecklist/service/serviceChecklist';

export function useChecklistData() {
  const [data, setData] = useState<ChecklistItem[]>([]);
  const [pagination, setPagination] = useState<PaginationResponse>({ total_count: 0, total_pages: 0, current_page: 0 });
  const [loading, setLoading] = useState(true);

  const loadData = async (offset?: number, limit?: number, role?: string) => {
    setLoading(true);
    const result = await getChecklistData(offset, limit, role);
    if (result.success) {
      setData(result.data);
      if (result.pagination) setPagination(result.pagination);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData(0, 5);
  }, []);

  return {
    data,
    setData,
    pagination,
    loading,
    reloadData: loadData
  };
}
