export function getRoleLabel(role: string): string {
  const map: Record<string, string> = {
    anonymous: 'รอการอนุมัติ',
    user: 'ผู้ใช้งาน',
    driver: 'คนขับ',
    admin: 'ผู้ดูแล',
    super_admin: 'ผู้ดูแลสูงสุด',
  };
  return map[role] ?? role;
}

export function getRoleBadgeClass(role: string): string {
  const map: Record<string, string> = {
    anonymous: 'bg-gray-100 text-gray-600',
    user: 'bg-blue-100 text-blue-700',
    driver: 'bg-purple-100 text-purple-700',
    admin: 'bg-orange-100 text-orange-700',
    super_admin: 'bg-red-100 text-red-700',
  };
  return map[role] ?? 'bg-gray-100 text-gray-600';
}

export function createItemsPerPageOptions() {
  return [
    { value: '5', label: '5 รายการ' },
    { value: '10', label: '10 รายการ' },
    { value: '20', label: '20 รายการ' },
  ];
}
