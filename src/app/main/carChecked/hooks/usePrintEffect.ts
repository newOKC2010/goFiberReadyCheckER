import { useEffect } from 'react';
import { CarCheckedItem } from '@/app/main/carChecked/utils/types';

export function usePrintEffect(
  printItem: CarCheckedItem | null,
  setPrintLoading: (loading: boolean) => void,
  setPrintItem: (item: CarCheckedItem | null) => void
) {
  useEffect(() => {
    if (printItem) {
      setPrintLoading(true);
      const timer = setTimeout(() => {
        window.print();
        setPrintItem(null);
        setPrintLoading(false);
      }, 500);
      
      return () => {
        clearTimeout(timer);
        setPrintLoading(false);
      };
    }
  }, [printItem, setPrintLoading, setPrintItem]);
}
