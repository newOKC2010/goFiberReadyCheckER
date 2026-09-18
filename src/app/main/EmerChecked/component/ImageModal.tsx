'use client';

import { Modal } from '@/components/modal/mainModal';
import { useState, useEffect } from 'react';
import { AuthToken } from '@/global/globalAuth';

interface ImageModalProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function ImageModal({ images, currentIndex, isOpen, onClose, onNext, onPrevious }: ImageModalProps) {
  const [imageSrc, setImageSrc] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && images.length > 0 && currentIndex >= 0) {
      setLoading(true);
      setImageSrc('');
      const token = AuthToken.getToken();
      fetch(images[currentIndex], { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.blob() : null)
        .then(b => { if (b) setImageSrc(URL.createObjectURL(b)); })
        .finally(() => setLoading(false));
    }
  }, [isOpen, images, currentIndex]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" showCloseButton={false} contentClassName="!max-w-5xl !p-0">
      <div className="relative w-full bg-white rounded-xl overflow-hidden" style={{ minHeight: 500, maxHeight: '85vh' }}>
        <div className="absolute top-4 left-4 z-50 bg-gray-800/80 text-white px-3 py-1 rounded-lg text-sm font-bold">{currentIndex + 1} / {images.length}</div>
        <button onClick={onClose} className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full flex items-center justify-center text-white bg-red-500 hover:bg-red-600 cursor-pointer">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'wght' 700" }}>cancel</span>
        </button>
        <div className="w-full h-full flex items-center justify-center p-4">
          {loading ? (<span className="material-symbols-outlined animate-spin text-4xl text-blue-500">progress_activity</span>)
            : (imageSrc && <img src={imageSrc} alt={`รูปภาพ ${currentIndex + 1}`} className="max-w-full max-h-full object-contain" />)}
        </div>
        {images.length > 1 && (<>
          <button onClick={onPrevious} disabled={currentIndex === 0} className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-2 shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'wght' 700" }}>chevron_left</span>
          </button>
          <button onClick={onNext} disabled={currentIndex === images.length - 1} className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-2 shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'wght' 700" }}>chevron_right</span>
          </button>
        </>)}
      </div>
    </Modal>
  );
}
