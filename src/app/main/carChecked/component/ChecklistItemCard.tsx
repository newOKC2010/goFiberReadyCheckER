import { ChecklistItem } from '@/app/main/carChecked/utils/types';
import { useState, useEffect } from 'react';
import ImageModal from '@/app/main/carChecked/component/ImageModal';
import { AuthToken } from '@/global/globalAuth';
import { API_BASE_URL } from '@/global/globalApi';

interface ChecklistItemCardProps {
  item: ChecklistItem;
  index: number;
}

export default function ChecklistItemCard({ item, index }: ChecklistItemCardProps) {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageClick = (imageIndex: number) => {
    setCurrentImageIndex(imageIndex);
    setImageModalOpen(true);
  };

  const handleNextImage = () => {
    if (currentImageIndex < item.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const imageUrls = item.images.map(img => {
    const cleanPath = img.startsWith('/') ? img.substring(1) : img;
    return `${API_BASE_URL}/car-checked/view-image/${cleanPath}`;
  });

  return (
    <div className={`p-4 rounded-xl ${item.status ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <span className={`material-symbols-outlined text-2xl ${item.status ? 'text-green-500' : 'text-red-500'}`} style={{ fontVariationSettings: "'wght' 700" }}>
            {item.status ? 'check_circle' : 'cancel'}
          </span>
          <div>
            <h4 className="font-bold text-gray-800">{item.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${item.status ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {item.status ? 'ผ่าน' : 'ไม่ผ่าน'}
              </span>
              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${item.status ? 'bg-white text-green-700' : 'bg-white text-red-700'}`}>
                #{index + 1}
              </span>
            </div>
          </div>
        </div>
      </div>

      {item.note && (
        <div className="mb-3 bg-yellow-50 p-3 rounded-xl border-l-4 border-yellow-50">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-yellow-600 text-lg" style={{ fontVariationSettings: "'wght' 700" }}>sticky_note_2</span>
            <div>
              <p className="text-sm font-bold text-gray-700">หมายเหตุ:</p>
              <p className="text-sm font-bold text-gray-800">{item.note}</p>
            </div>
          </div>
        </div>
      )}

      {item.images.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-blue-600 text-lg" style={{ fontVariationSettings: "'wght' 700" }}>image</span>
            <p className="text-sm font-bold text-gray-800">รูปภาพการตรวจสอบ ({item.images.length} รูป)</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {item.images.map((image, idx) => (
              <div
                key={idx}
                onClick={() => handleImageClick(idx)}
                className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors cursor-pointer group"
              >
                <ImageWithToken
                  src={`${API_BASE_URL}/car-checked/view-image/${image.startsWith('/') ? image.substring(1) : image}`}
                  alt={`รูปภาพ ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                  <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity text-3xl">
                    zoom_in
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ImageModal
        images={imageUrls}
        currentIndex={currentImageIndex}
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onNext={handleNextImage}
        onPrevious={handlePreviousImage}
      />
    </div>
  );
}

function ImageWithToken({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
      setError(false);
      try {
        const token = AuthToken.getToken();
        console.log('🖼️ Loading thumbnail:', src);
        const response = await fetch(src, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('📸 Thumbnail response:', response.status);
        if (!response.ok) {
          console.error('❌ Failed to load thumbnail:', response.status, response.statusText, src);
          setError(true);
          setLoading(false);
          return;
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        console.log('✅ Thumbnail loaded:', url);
        setImageSrc(url);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error loading thumbnail:', error, src);
        setError(true);
        setLoading(false);
      }
    };
    fetchImage();
  }, [src]);

  if (loading) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <span className="material-symbols-outlined text-gray-400 animate-pulse">image</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} bg-red-50 flex items-center justify-center`}>
        <span className="material-symbols-outlined text-red-400">broken_image</span>
      </div>
    );
  }

  return imageSrc ? <img src={imageSrc} alt={alt} className={className} /> : null;
}
