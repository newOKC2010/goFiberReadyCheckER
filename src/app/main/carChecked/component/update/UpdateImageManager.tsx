'use client';

import { API_BASE_URL } from '@/global/globalApi';
import { UpdateImageManagerProps } from '@/app/main/carChecked/component/update/utils/types';
import { useEffect, useState } from 'react';
import { AuthToken } from '@/global/globalAuth';

export default function UpdateImageManager({
  checklistId,
  existingImages,
  newImages,
  onExistingImagesChange,
  onNewImagesChange
}: UpdateImageManagerProps) {
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string }>({});

  // Load existing images
  useEffect(() => {
    const loadImages = async () => {
      const previews: { [key: string]: string } = {};
      for (const imagePath of existingImages) {
        try {
          const token = AuthToken.getToken();
          const url = `${API_BASE_URL}/car-checked/view-image/${imagePath.startsWith('/') ? imagePath.substring(1) : imagePath}`;
          const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const blob = await response.blob();
            previews[imagePath] = URL.createObjectURL(blob);
          }
        } catch (error) {
          console.error('Error loading image:', error);
        }
      }
      setImagePreviews(previews);
    };

    if (existingImages.length > 0) {
      loadImages();
    }

    return () => {
      Object.values(imagePreviews).forEach(url => URL.revokeObjectURL(url));
    };
  }, [existingImages]);

  const handleRemoveExisting = (imagePath: string) => {
    const updated = existingImages.filter(img => img !== imagePath);
    onExistingImagesChange(updated);
    
    if (imagePreviews[imagePath]) {
      URL.revokeObjectURL(imagePreviews[imagePath]);
      const newPreviews = { ...imagePreviews };
      delete newPreviews[imagePath];
      setImagePreviews(newPreviews);
    }
  };

  const handleAddNew = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    onNewImagesChange([...newImages, ...files]);
  };

  const handleRemoveNew = (index: number) => {
    const updated = newImages.filter((_, i) => i !== index);
    onNewImagesChange(updated);
  };

  const totalImages = existingImages.length + newImages.length;

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        รูปภาพประกอบ ({totalImages} รูป)
      </label>

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-bold text-gray-600 mb-2">รูปเดิม ({existingImages.length})</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {existingImages.map((imagePath) => (
              <div key={imagePath} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-blue-300 bg-gray-100">
                  {imagePreviews[imagePath] ? (
                    <img
                      src={imagePreviews[imagePath]}
                      alt="Existing"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="material-symbols-outlined text-gray-400">image</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveExisting(imagePath)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 
                             text-white rounded-full flex items-center justify-center
                             shadow-lg transition-all group-hover:scale-110"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Images */}
      {newImages.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-bold text-green-600 mb-2">รูปใหม่ ({newImages.length})</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {newImages.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-green-300 bg-gray-100">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveNew(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 
                             text-white rounded-full flex items-center justify-center
                             shadow-lg transition-all group-hover:scale-110"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Button */}
      <label
        htmlFor={`file-upload-update-${checklistId}`}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 
                   text-white font-bold rounded-lg cursor-pointer transition-colors text-sm"
      >
        <span className="material-symbols-outlined text-xl">add_photo_alternate</span>
        <span>เพิ่มรูปภาพใหม่</span>
      </label>
      <input
        id={`file-upload-update-${checklistId}`}
        type="file"
        multiple
        accept="image/*"
        onChange={handleAddNew}
        className="hidden"
      />

      {totalImages === 0 && (
        <p className="text-sm text-gray-500 font-bold mt-2">ยังไม่มีรูปภาพ</p>
      )}
    </div>
  );
}
