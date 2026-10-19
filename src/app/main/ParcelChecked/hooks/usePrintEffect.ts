import { useEffect } from 'react';
import { ParcelCheckedItem } from '@/app/main/ParcelChecked/utils/types';

export function usePrintEffect(
  printItem: ParcelCheckedItem | null,
  setPrintLoading: (v: boolean) => void,
  setPrintItem: (item: ParcelCheckedItem | null) => void
) {
  useEffect(() => {
    if (printItem) {
      setPrintLoading(true);
      const timer = setTimeout(() => { window.print(); setPrintItem(null); setPrintLoading(false); }, 500);
      return () => { clearTimeout(timer); setPrintLoading(false); };
    }
  }, [printItem, setPrintLoading, setPrintItem]);
}
