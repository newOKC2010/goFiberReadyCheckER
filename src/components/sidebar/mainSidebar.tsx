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

const ALL_MENUS = [
  {
    name: 'ตรวจสอบรถ',
    icon: 'local_shipping',
    excludeRoles: [] as string[],
    children: [
      { name: 'Ambulance', icon: 'ambulance', path: '/main/carChecked', excludeRoles: [] as string[] },
      { name: 'รถ Emergency', icon: 'emergency', path: '/main/EmerChecked', excludeRoles: [] as string[] },
    ]
  },
  {
    name: 'รายการตรวจสอบ',
    icon: 'checklist',
    excludeRoles: [USER_ROLES.USER] as string[],
    children: [
      { name: 'Ambulance', icon: 'ambulance', path: '/main/carChecklist', excludeRoles: [USER_ROLES.USER] as string[] },
      { name: 'รถ Emergency', icon: 'emergency', path: '/main/EmerChecklist', excludeRoles: [USER_ROLES.USER] as string[] },
    ]
  },
  {
    name: 'รายชื่อทะเบียนรถ',
    icon: 'list_alt',
    excludeRoles: [USER_ROLES.USER] as string[],
    children: [
      { name: 'Ambulance', icon: 'ambulance', path: '/main/carList', excludeRoles: [USER_ROLES.USER] as string[] },
      { name: 'รถ Emergency', icon: 'emergency', path: '/main/EmerList', excludeRoles: [USER_ROLES.USER] as string[] },
    ]
  },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);
  const toggleSidebar = () => setIsOpen(true);

  const filteredMenus = ALL_MENUS.filter(menu => 
    !user?.role || !menu.excludeRoles.includes(user.role)
  );

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
