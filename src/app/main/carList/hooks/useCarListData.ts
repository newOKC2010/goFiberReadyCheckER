import { useState, useEffect } from 'react';
import { CarItem } from '@/app/main/carList/utils/types';
import { getCarListData } from '@/app/main/carList/service/serviceCarList';

export function useCarListData() {
  const [data, setData] = useState<CarItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const result = await getCarListData();
    if (result.success) {
      setData(result.data);
    }
    setLoading(false);
  };

  const reloadData = () => {
    loadData();
  };

  return { data, loading, reloadData };
}
