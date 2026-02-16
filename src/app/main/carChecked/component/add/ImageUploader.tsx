'use client';

interface ImageUploaderProps {
  checklistId: string;
  images: File[];
  onImagesChange: (images: File[]) => void;
}

export default function ImageUploader({ checklistId, images, onImagesChange }: ImageUploaderProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    onImagesChange([...images, ...newFiles]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">รูปภาพประกอบ</label>
      
      <label 
        htmlFor={`file-upload-${checklistId}`}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 
                   text-white font-bold rounded-lg cursor-pointer transition-colors text-sm"
      >
        <span className="material-symbols-outlined text-xl">add_photo_alternate</span>
        <span>เพิ่มรูปภาพ (สามารถเลือกหลายรูป)</span>
      </label>
      <input
        id={`file-upload-${checklistId}`}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((file, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 
                           text-white rounded-full flex items-center justify-center
                           shadow-lg transition-all group-hover:scale-110"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
