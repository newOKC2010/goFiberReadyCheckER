import { useState } from 'react';

interface MenuItem {
  name: string;
  icon: string;
  path?: string;
  excludeRoles: string[];
  requireDepartment?: string;
  children?: MenuItem[];
}

interface SidebarMenuProps {
  menus: MenuItem[];
  currentPath: string;
  onMenuClick: (path: string) => void;
}

export default function SidebarMenu({ menus, currentPath, onMenuClick }: SidebarMenuProps) {
  const isActive = (path?: string) => path === currentPath;

  return (
    <nav className="flex-1 p-4 space-y-2">
      {menus.map((menu) => (
        <button
          key={menu.path || menu.name}
          onClick={() => menu.path && onMenuClick(menu.path)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 cursor-pointer
            ${isActive(menu.path)
              ? 'bg-red-50 text-red-600 shadow-sm'
              : 'text-gray-600 hover:bg-gray-50 hover:scale-105 hover:shadow-md'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 700" }}>
            {menu.icon}
          </span>
          <span className="flex-1 text-left">{menu.name}</span>
        </button>
      ))}
    </nav>
  );
}
