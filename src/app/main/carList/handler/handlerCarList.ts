import { CarItem } from '@/app/main/carList/utils/types';

export function paginateData(data: CarItem[], currentPage: number, itemsPerPage: number) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return { paginatedData, totalPages };
}

export function createItemsPerPageOptions() {
  return [
    { value: '5', label: '5 รายการ' },
    { value: '10', label: '10 รายการ' }
  ];
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
