'use client';

import { API_BASE_URL } from '@/global/globalApi';
import { UpdateImageManagerProps } from '@/app/main/EmerChecked/component/update/utils/types';
import { useEffect, useState } from 'react';
import { AuthToken } from '@/global/globalAuth';

export default function UpdateImageManager({ checklistId, existingImages, newImages, onExistingImagesChange, onNewImagesChange }: UpdateImageManagerProps) {
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!existingImages.length) return;
    const loadImages = async () => {
      const p: { [k: string]: string } = {};
      for (const path of existingImages) {
        try {
          const token = AuthToken.getToken();
          const url = `${API_BASE_URL}/emergency-checked/view-image/${path.startsWith('/') ? path.substring(1) : path}`;
          const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) p[path] = URL.createObjectURL(await res.blob());
        } catch {}
      }
      setPreviews(p);
    };
    loadImages();
    return () => { Object.values(previews).forEach(URL.revokeObjectURL); };
  }, [existingImages]);

  const handleRemoveExisting = (path: string) => {
    onExistingImagesChange(existingImages.filter(img => img !== path));
    if (previews[path]) { URL.revokeObjectURL(previews[path]); const p = { ...previews }; delete p[path]; setPreviews(p); }
  };

  const totalImages = existingImages.length + newImages.length;

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">รูปภาพประกอบ ({totalImages} รูป)</label>
      {existingImages.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-bold text-gray-600 mb-2">รูปเดิม ({existingImages.length})</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {existingImages.map(path => (
              <div key={path} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-blue-300 bg-gray-100">
                  {previews[path] ? <img src={previews[path]} alt="Existing" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-gray-200"><span className="material-symbols-outlined text-gray-400">image</span></div>}
                </div>
                <button type="button" onClick={() => handleRemoveExisting(path)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {newImages.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-bold text-green-600 mb-2">รูปใหม่ ({newImages.length})</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {newImages.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-green-300 bg-gray-100">
                  <img src={URL.createObjectURL(file)} alt={`New ${index + 1}`} className="w-full h-full object-cover" />
                </div>
                <button type="button" onClick={() => onNewImagesChange(newImages.filter((_, i) => i !== index))} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <label htmlFor={`file-upload-${checklistId}`} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer transition-colors text-sm">
        <span className="material-symbols-outlined text-xl">add_photo_alternate</span>
        <span>เพิ่มรูปภาพใหม่</span>
      </label>
      <input id={`file-upload-${checklistId}`} type="file" multiple accept="image/*" onChange={(e) => { if (e.target.files) onNewImagesChange([...newImages, ...Array.from(e.target.files)]); }} className="hidden" />
      {totalImages === 0 && <p className="text-sm text-gray-500 font-bold mt-2">ยังไม่มีรูปภาพ</p>}
    </div>
  );
}
