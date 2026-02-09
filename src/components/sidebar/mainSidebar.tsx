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
    name: 'รายงาน', 
    icon: 'description', 
    excludeRoles: [USER_ROLES.USER] as string[],
    children: [
      { name: 'ขอรายงาน', path: '/req/report/main', icon: 'edit_note', excludeRoles: [] as string[] },
      { name: 'อนุมัติจากหัวหน้าแผนก', path: '/req/report/lead', icon: 'task_alt', excludeRoles: [USER_ROLES.USER, USER_ROLES.STAFF, USER_ROLES.ADMIN, USER_ROLES.LEAD_ORGANI] as string[] },
      { name: 'อนุมัติจาก IT', path: '/req/report/admin', icon: 'verified', excludeRoles: [USER_ROLES.USER, USER_ROLES.STAFF, USER_ROLES.LEAD, USER_ROLES.LEAD_ORGANI] as string[] },
      { name: 'อนุมัติจากหัวหน้า IT', path: '/req/report/leadIT', icon: 'admin_panel_settings', excludeRoles: [USER_ROLES.USER, USER_ROLES.STAFF, USER_ROLES.ADMIN] as string[], requireDepartment: 'IT' },
      { name: 'ยืนยันการส่งข้อมูล', path: '/req/report/adminConfirm', icon: 'check_circle', excludeRoles: [USER_ROLES.USER, USER_ROLES.STAFF, USER_ROLES.LEAD, USER_ROLES.LEAD_ORGANI] as string[] }
    ]
  },
  { 
    name: 'CCTVวงจรปิด', 
    icon: 'videocam', 
    excludeRoles: [] as string[],
    children: [
      { name: 'ขอดูกล้อง', path: '/req/cctv/main', icon: 'video_camera_front', excludeRoles: [] as string[] },
      { name: 'อนุมัติคำขอ', path: '/req/cctv/admin', icon: 'verified', excludeRoles: [USER_ROLES.USER, USER_ROLES.STAFF, USER_ROLES.LEAD] as string[] }
    ]
  }
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);
  const toggleSidebar = () => setIsOpen(true);

  const filteredMenus = ALL_MENUS.filter(menu => 
    !user?.role || !menu.excludeRoles.includes(user.role)
  ).map(menu => {
    if (menu.children) {
      const filteredChildren = menu.children.filter(child => {
        const roleMatch = !user?.role || !child.excludeRoles.includes(user.role);
        const deptMatch = !child.requireDepartment || user?.department_name === child.requireDepartment || user?.role === USER_ROLES.SUPER_ADMIN;
        return roleMatch && deptMatch;
      });
      return filteredChildren.length > 0 ? { ...menu, children: filteredChildren } : null;
    }
    return menu;
  }).filter((menu): menu is NonNullable<typeof menu> => menu !== null);

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
