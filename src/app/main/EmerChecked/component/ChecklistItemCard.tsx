'use client';

import { ChecklistItem } from '@/app/main/EmerChecked/utils/types';
import { useState, useEffect } from 'react';
import ImageModal from '@/app/main/EmerChecked/component/ImageModal';
import { AuthToken } from '@/global/globalAuth';
import { API_BASE_URL } from '@/global/globalApi';

interface ChecklistItemCardProps {
  item: ChecklistItem;
  index: number;
  onEdit?: () => void;
}

export default function ChecklistItemCard({ item, index, onEdit }: ChecklistItemCardProps) {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imageUrls = (item.images && Array.isArray(item.images))
    ? item.images.map(img => `${API_BASE_URL}/emergency-checked/view-image/${img.startsWith('/') ? img.substring(1) : img}`)
    : [];

  return (
    <div className={`p-4 rounded-xl ${item.status ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-white text-lg flex-shrink-0 mt-0.5">{index + 1}</div>
          <div className="flex-1">
            <h4 className="text-gray-800 mb-1">{item.name}</h4>
            <span className={`px-3 py-1 rounded-full text-sm ${item.status ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {item.status ? 'ผ่าน' : 'ไม่ผ่าน'}
            </span>
          </div>
        </div>
        {onEdit && (
          <button onClick={onEdit} className="flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs sm:text-sm cursor-pointer">
            <span className="material-symbols-outlined text-base sm:text-lg">edit</span>
            <span>แก้ไข</span>
          </button>
        )}
      </div>

      {item.note && (
        <div className="mb-3 bg-yellow-50 p-3 rounded-xl border-l-4 border-yellow-400">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-yellow-600 text-lg" style={{ fontVariationSettings: "'wght' 700" }}>sticky_note_2</span>
            <div>
              <p className="text-sm text-gray-700">หมายเหตุ:</p>
              <p className="text-sm text-gray-800">{item.note}</p>
            </div>
          </div>
        </div>
      )}

      {imageUrls.length > 0 ? (
        <div className="mt-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-blue-600 text-lg" style={{ fontVariationSettings: "'wght' 700" }}>image</span>
            <p className="text-sm text-gray-800">รูปภาพการตรวจสอบ ({imageUrls.length} รูป)</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {item.images.map((img, idx) => (
              <div key={idx} onClick={() => { setCurrentImageIndex(idx); setImageModalOpen(true); }} className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors cursor-pointer">
                <ImageWithToken src={`${API_BASE_URL}/emergency-checked/view-image/${img.startsWith('/') ? img.substring(1) : img}`} alt={`รูปภาพ ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
          <span className="material-symbols-outlined text-gray-400 text-lg">image_not_supported</span>
          <p className="text-sm text-gray-600">ไม่มีรูปภาพการตรวจสอบ</p>
        </div>
      )}

      <ImageModal images={imageUrls} currentIndex={currentImageIndex} isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)}
        onNext={() => setCurrentImageIndex(i => Math.min(i + 1, imageUrls.length - 1))}
        onPrevious={() => setCurrentImageIndex(i => Math.max(i - 1, 0))} />
    </div>
  );
}

function ImageWithToken({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [imageSrc, setImageSrc] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(false); setImageSrc('');
    const token = AuthToken.getToken();
    fetch(src, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error(); return r.blob(); })
      .then(b => { if (!cancelled && b.size > 0 && b.type.startsWith('image/')) { setImageSrc(URL.createObjectURL(b)); setLoading(false); } else if (!cancelled) setError(true); })
      .catch(() => { if (!cancelled) { setError(true); setLoading(false); } });
    return () => { cancelled = true; };
  }, [src]);

  if (loading) return <div className={`${className} bg-gray-200 flex items-center justify-center`}><span className="material-symbols-outlined text-gray-400 animate-pulse text-4xl">image</span></div>;
  if (error || !imageSrc) return <div className={`${className} bg-red-100 flex items-center justify-center`}><span className="material-symbols-outlined text-red-500 text-4xl">broken_image</span></div>;
  return <img src={imageSrc} alt={alt} className={className} />;
}
