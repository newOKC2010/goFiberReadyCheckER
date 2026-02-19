import { useState, useEffect } from 'react';
import { ChecklistItem } from '@/app/main/carChecklist/utils/types';
import { getChecklistData } from '@/app/main/carChecklist/service/serviceChecklist';

export function useChecklistData() {
  const [data, setData] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const result = await getChecklistData();
    if (result.success) {
      setData(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    data,
    setData,
    loading,
    reloadData: loadData
  };
}
