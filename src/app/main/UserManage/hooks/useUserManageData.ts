import { useState, useEffect } from 'react';
import { UserItem, PaginationResponse } from '@/app/main/UserManage/utils/types';
import { getUserList, UserFilter } from '@/app/main/UserManage/service/serviceUserManage';

export function useUserManageData() {
  const [data, setData] = useState<UserItem[]>([]);
  const [pagination, setPagination] = useState<PaginationResponse>({ total_count: 0, total_pages: 0, current_page: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(0, 5); }, []);

  const loadData = async (offset?: number, limit?: number, filter?: UserFilter) => {
    setLoading(true);
    const result = await getUserList(offset, limit, filter);
    if (result.success) {
      setData(result.data ?? []);
      if (result.pagination) setPagination(result.pagination);
    }
    setLoading(false);
  };

  return { data, pagination, loading, reloadData: loadData };
}
