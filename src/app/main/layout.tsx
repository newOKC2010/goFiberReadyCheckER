'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { checkAuth, UserStaffInfo, USER_ROLES } from '@/global/globalAuth';
import { showAlert } from '@/global/globalSwal';
import Sidebar from '@/components/sidebar/mainSidebar';
import Loading from '@/components/loading/mainLoading';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserStaffInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      setLoading(true);
      const auth = await checkAuth();
      
      if (!auth.success) {
        setUser(null);
        router.replace('/auth?error=no_token');
        return;
      }

      setUser(auth.user || null);
      
      // ตรวจสอบ role ก่อนแสดงหน้า
      if (auth.user?.role === USER_ROLES.USER && 
          (pathname === '/main/carChecklist' || pathname === '/main/carList')) {
        await showAlert('ไม่มีสิทธิ์เข้าถึง', 'เฉพาะ Admin เท่านั้น', 'error');
        router.replace('/main/carChecked');
        return;
      }

      setLoading(false);
    };
    
    verify();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
        <Loading message="กำลังตรวจสอบสิทธิ์" delay={2000} fullScreen={false} />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar user={user} />
      <main className="flex-1 overflow-auto bg-gray-50 lg:ml-0">
        <div className="lg:hidden h-16" /> {/* Spacer for mobile button */}
        {children}
      </main>
    </div>
  );
}