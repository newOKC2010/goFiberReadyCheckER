import { useEffect } from 'react';
import { EmerCheckedItem } from '@/app/main/EmerChecked/utils/types';

export function usePrintEffect(
  printItem: EmerCheckedItem | null,
  setPrintLoading: (v: boolean) => void,
  setPrintItem: (item: EmerCheckedItem | null) => void
) {
  useEffect(() => {
    if (printItem) {
      setPrintLoading(true);
      const timer = setTimeout(() => { window.print(); setPrintItem(null); setPrintLoading(false); }, 500);
      return () => { clearTimeout(timer); setPrintLoading(false); };
    }
  }, [printItem, setPrintLoading, setPrintItem]);
}
