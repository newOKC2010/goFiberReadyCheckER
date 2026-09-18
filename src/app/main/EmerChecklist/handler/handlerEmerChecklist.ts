export function createItemsPerPageOptions() {
  return [
    { value: '5', label: '5 รายการ' },
    { value: '10', label: '10 รายการ' }
  ];
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('th-TH', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}
