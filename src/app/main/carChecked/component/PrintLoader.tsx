interface PrintLoaderProps {
  loading: boolean;
}

export default function PrintLoader({ loading }: PrintLoaderProps) {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center no-print">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
        <p className="text-white font-medium text-lg">กำลังเตรียมข้อมูลสำหรับพิมพ์...</p>
      </div>
    </div>
  );
}
