import { CarCheckedItem } from '@/app/main/carChecked/utils/types';
import { API_BASE_URL } from '@/global/globalApi';
import { useEffect, useState } from 'react';
import { AuthToken } from '@/global/globalAuth';

interface PrintContentProps {
  item: CarCheckedItem;
}

export default function PrintContent({ item }: PrintContentProps) {
  const totalItems = item.checklist_items.items.length;
  const passedItems = item.checklist_items.items.filter(i => i.status).length;
  
  return (
    <div className="bg-white" style={{ fontWeight: 'bold', width: '100%', maxWidth: '210mm', padding: '20mm 15mm' }}>
      <style>{`
        @media print {
          @page { 
            margin: 0; 
            size: A4 portrait; 
          }
          body { 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
            margin: 0;
            padding: 0;
            overflow: visible;
          }
          * { 
            print-color-adjust: exact; 
            -webkit-print-color-adjust: exact; 
            font-weight: bold !important; 
            overflow: visible !important;
            box-sizing: border-box;
          }
          ::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }
          button { display: none !important; }
          [role="button"] { display: none !important; }
          .material-symbols-outlined { display: none !important; }
        }
      `}</style>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">รายงานการตรวจสอบสภาพรถพยาบาล</h1>
        <div className="border-t-2 border-b-2 border-black py-2 mt-2">
          <p className="font-bold">ทะเบียนรถ: {item.license_plate_name}</p>
          <p className="font-bold">วันที่ตรวจสอบ: {item.checked_date}</p>
          <p className="font-bold">ผู้ตรวจสอบ: {item.checked_by || '-'}</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="font-bold text-lg mb-2">สรุปผลการตรวจสอบ</p>
        <div className="p-4">
          <p className="font-bold">รายการที่ผ่านการตรวจสอบ: {passedItems}/{totalItems} รายการ</p>
        </div>
      </div>

      <div className="space-y-6">
        <p className="font-bold text-lg mb-4">รายละเอียดการตรวจสอบ</p>
        {item.checklist_items.items.map((checklistItem, index) => (
          <PrintChecklistItem
            key={checklistItem.checklist_id}
            item={checklistItem}
            index={index}
          />
        ))}
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
          <p className="font-bold text-sm mt-1">
            สถานะ: <span className={item.status ? 'text-green-600' : 'text-red-600'}>
              {item.status ? 'ผ่าน' : 'ไม่ผ่าน'}
            </span>
          </p>
        </div>
      </div>

      {item.note && (
        <div className="mb-3 pl-6">
          <p className="font-bold text-sm">หมายเหตุ: {item.note}</p>
        </div>
      )}

      {(item.images && Array.isArray(item.images) && item.images.length > 0) ? (
        <div className="pl-6">
          <p className="font-bold text-sm mb-2">รูปภาพประกอบ: ({item.images.length} รูป)</p>
          <div className="grid grid-cols-3 gap-2">
            {item.images.map((image: string, idx: number) => (
              <PrintImage
                key={idx}
                src={`${API_BASE_URL}/car-checked/view-image/${image.startsWith('/') ? image.substring(1) : image}`}
                alt={`รูปภาพ ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="pl-6">
          <p className="font-bold text-sm text-gray-600">ไม่มีรูปภาพประกอบ</p>
        </div>
      )}
    </div>
  );
}

function PrintImage({ src, alt }: { src: string; alt: string }) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const token = AuthToken.getToken();
        const response = await fetch(src, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const blob = await response.blob();
          setImageSrc(URL.createObjectURL(blob));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchImage();
  }, [src]);

  if (loading) {
    return <div className="aspect-square bg-gray-200 border border-gray-300" />;
  }

  if (!imageSrc) {
    return <div className="aspect-square bg-gray-100 border border-gray-300" />;
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className="w-full aspect-square object-cover border border-gray-300"
      style={{ backgroundColor: '#ffffff' }}
    />
  );
}
