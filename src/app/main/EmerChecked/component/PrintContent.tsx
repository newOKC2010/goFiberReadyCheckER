'use client';

import { EmerCheckedItem } from '@/app/main/EmerChecked/utils/types';
import { API_BASE_URL } from '@/global/globalApi';
import { useEffect, useState } from 'react';
import { AuthToken } from '@/global/globalAuth';

export default function PrintContent({ item }: { item: EmerCheckedItem }) {
  const boolItems = item.checklist_items.items.filter(i => i.item_type === 'boolean');
  const total = boolItems.length;
  const passed = boolItems.filter(i => i.status).length;

  return (
    <div className="bg-white" style={{ fontWeight: 'bold', width: '100%', maxWidth: '210mm', padding: '20mm 15mm' }}>
      <style>{`
        @media print {
          @page { margin: 0; size: A4 portrait; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; overflow: visible; }
          * { print-color-adjust: exact; -webkit-print-color-adjust: exact; font-weight: bold !important; overflow: visible !important; box-sizing: border-box; }
          button, [role="button"], .material-symbols-outlined { display: none !important; }
        }
      `}</style>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">รายงานการตรวจสอบสภาพรถ Emergency</h1>
        <div className="border-t-2 border-b-2 border-black py-2 mt-2">
          <p className="font-bold">ทะเบียนรถ: {item.license_plate_name}</p>
          <p className="font-bold">วันที่ตรวจสอบ: {item.checked_date}</p>
          <p className="font-bold">ผู้ตรวจสอบ: {item.checked_by || '-'}</p>
        </div>
      </div>
      <div className="mb-6">
        <p className="font-bold text-lg mb-2">สรุปผลการตรวจสอบ</p>
        <div className="p-4"><p className="font-bold">รายการที่ผ่านการตรวจสอบ: {passed}/{total} รายการ</p></div>
      </div>
      <div className="space-y-6">
        <p className="font-bold text-lg mb-4">รายละเอียดการตรวจสอบ</p>
        {item.checklist_items.items.map((ci, index) => <PrintChecklistItem key={ci.checklist_id} item={ci} index={index} />)}
      </div>
    </div>
  );
}

function PrintChecklistItem({ item, index }: { item: any; index: number }) {
  return (
    <div className="p-4 break-inside-avoid">
      <div className="flex items-start gap-2 mb-3">
        <span className="font-bold">{index + 1}.</span>
        <div className="flex-1">
          <p className="font-bold text-base">{item.name}</p>
          {item.item_type === 'boolean' ? (
            <p className="font-bold text-sm mt-1">สถานะ: <span className={item.status ? 'text-green-600' : 'text-red-600'}>{item.status ? 'ผ่าน' : 'ไม่ผ่าน'}</span></p>
          ) : (
            <p className="font-bold text-sm mt-1">ข้อมูล: {item.note || '-'}</p>
          )}
        </div>
      </div>
      {item.item_type === 'boolean' && item.note && <div className="mb-3 pl-6"><p className="font-bold text-sm">หมายเหตุ: {item.note}</p></div>}
      {item.images?.length > 0 ? (
        <div className="pl-6">
          <p className="font-bold text-sm mb-2">รูปภาพประกอบ: ({item.images.length} รูป)</p>
          <div className="grid grid-cols-3 gap-2">
            {item.images.map((img: string, idx: number) => (
              <PrintImage key={idx} src={`${API_BASE_URL}/emergency-checked/view-image/${img.startsWith('/') ? img.substring(1) : img}`} alt={`รูปภาพ ${idx + 1}`} />
            ))}
          </div>
        </div>
      ) : (
        <div className="pl-6"><p className="font-bold text-sm text-gray-600">ไม่มีรูปภาพประกอบ</p></div>
      )}
    </div>
  );
}

function PrintImage({ src, alt }: { src: string; alt: string }) {
  const [imageSrc, setImageSrc] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = AuthToken.getToken();
    fetch(src, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.blob() : null)
      .then(b => { if (b) setImageSrc(URL.createObjectURL(b)); })
      .finally(() => setLoading(false));
  }, [src]);

  if (loading) return <div className="aspect-square bg-gray-200 border border-gray-300" />;
  if (!imageSrc) return <div className="aspect-square bg-gray-100 border border-gray-300" />;
  return <img src={imageSrc} alt={alt} className="w-full aspect-square object-cover border border-gray-300" />;
}
