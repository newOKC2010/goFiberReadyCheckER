'use client';

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
  const isChildActive = (children?: MenuItem[]) =>
    children?.some((c) => c.path === currentPath) ?? false;

  const [openMenus, setOpenMenus] = useState<string[]>(() =>
    menus.filter((m) => isChildActive(m.children)).map((m) => m.name)
  );

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  return (
    <nav className="flex-1 p-4 space-y-2">
      {menus.map((menu) => {
        const hasChildren = menu.children && menu.children.length > 0;
        const isOpen = openMenus.includes(menu.name);
        const childActive = isChildActive(menu.children);

        return (
          <div key={menu.path || menu.name}>
            <button
              onClick={() => {
                if (hasChildren) {
                  toggleMenu(menu.name);
                  // navigate ไปยัง child แรกเมื่อคลิก parent
                  const firstChild = menu.children?.find(c => c.path);
                  if (firstChild?.path && !isChildActive(menu.children)) onMenuClick(firstChild.path);
                } else if (menu.path) onMenuClick(menu.path);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 cursor-pointer
                ${isActive(menu.path) || childActive
                  ? 'bg-red-50 text-red-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:scale-105 hover:shadow-md'
                }`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 700" }}>
                {menu.icon}
              </span>
              <span className="flex-1 text-left">{menu.name}</span>
              {hasChildren && (
                <span className="material-symbols-outlined text-sm transition-transform duration-200"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', fontSize: '18px' }}>
                  expand_more
                </span>
              )}
            </button>

            {hasChildren && isOpen && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-red-100 pl-3">
                {menu.children!.map((child) => (
                  <button
                    key={child.path || child.name}
                    onClick={() => child.path && onMenuClick(child.path)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer
                      ${isActive(child.path)
                        ? 'bg-red-50 text-red-600 shadow-sm'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                      }`}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                      {child.icon}
                    </span>
                    <span>{child.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
