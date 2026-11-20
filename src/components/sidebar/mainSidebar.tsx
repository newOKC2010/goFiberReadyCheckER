'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { UserStaffInfo, USER_ROLES } from '@/global/globalAuth';
import { handleLogout, handleMenuClick } from '@/components/sidebar/handler/sidebarHandler';
import MobileToggle from '@/components/sidebar/component/MobileToggle';
import SidebarBackdrop from '@/components/sidebar/component/SidebarBackdrop';
import SidebarHeader from '@/components/sidebar/component/SidebarHeader';
import SidebarMenu from '@/components/sidebar/component/SidebarMenu';
import SidebarFooter from '@/components/sidebar/component/SidebarFooter';

interface SidebarProps {
  user: UserStaffInfo | null;
}

const NO_DRIVER = [USER_ROLES.USER, USER_ROLES.DRIVER] as string[];
const NO_USER   = [USER_ROLES.USER] as string[];

const ALL_MENUS = [
  {
    name: 'ตรวจสอบรถ',
    icon: 'local_shipping',
    excludeRoles: [] as string[],
    children: [
      { name: 'Ambulance',    icon: 'ambulance',  path: '/main/carChecked',  excludeRoles: [] as string[] },
      { name: 'รถ Emergency', icon: 'emergency',  path: '/main/EmerChecked', excludeRoles: [USER_ROLES.DRIVER] as string[] },
    ]
  },
  {
    name: 'ตรวจสอบพัสดุ',
    icon: 'inventory_2',
    excludeRoles: [USER_ROLES.DRIVER] as string[],
    children: [
      { name: 'พัสดุ', icon: 'package_2', path: '/main/ParcelChecked', excludeRoles: [USER_ROLES.DRIVER] as string[] },
    ]
  },
  {
    name: 'รายการตรวจสอบ',
    icon: 'checklist',
    excludeRoles: NO_DRIVER,
    children: [
      { name: 'Ambulance',    icon: 'ambulance',  path: '/main/carChecklist',   excludeRoles: NO_DRIVER },
      { name: 'รถ Emergency', icon: 'emergency',  path: '/main/EmerChecklist',  excludeRoles: NO_DRIVER },
      { name: 'พัสดุ',       icon: 'package_2',  path: '/main/ParcelChecklist', excludeRoles: NO_DRIVER },
    ]
  },
  {
    name: 'รายชื่อทะเบียนรถ',
    icon: 'list_alt',
    excludeRoles: NO_DRIVER,
    children: [
      { name: 'Ambulance',    icon: 'ambulance', path: '/main/carList',  excludeRoles: NO_DRIVER },
      { name: 'รถ Emergency', icon: 'emergency', path: '/main/EmerList', excludeRoles: NO_DRIVER },
    ]
  },
  {
    name: 'รายการพัสดุ',
    icon: 'inventory',
    excludeRoles: NO_DRIVER,
    children: [
      { name: 'พัสดุ', icon: 'package_2', path: '/main/ParcelList', excludeRoles: NO_DRIVER },
    ]
  },
  {
    name: 'จัดการผู้ใช้งาน',
    icon: 'manage_accounts',
    excludeRoles: NO_DRIVER,
    children: [
      { name: 'รายชื่อผู้ใช้งาน', icon: 'group', path: '/main/UserManage', excludeRoles: NO_DRIVER },
    ]
  },
];

// suppress unused variable warning
void NO_USER;

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);
  const toggleSidebar = () => setIsOpen(true);

  const filteredMenus = ALL_MENUS
    .filter(menu => !user?.role || !menu.excludeRoles.includes(user.role))
    .map(menu => ({
      ...menu,
      children: menu.children.filter(
        child => !user?.role || !child.excludeRoles.includes(user.role)
      ),
    }))
    .filter(menu => menu.children.length > 0);

  return (
    <>
      <MobileToggle isOpen={isOpen} onToggle={toggleSidebar} />
      <SidebarBackdrop isOpen={isOpen} onClose={closeSidebar} />

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-white border-r border-gray-200 flex flex-col h-screen
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <SidebarHeader user={user} onClose={closeSidebar} />
        <SidebarMenu 
          menus={filteredMenus} 
          currentPath={pathname} 
          onMenuClick={(path) => handleMenuClick(path, router, closeSidebar)} 
        />
        <SidebarFooter onLogout={() => handleLogout(router)} />
      </aside>
    </>
  );
}
