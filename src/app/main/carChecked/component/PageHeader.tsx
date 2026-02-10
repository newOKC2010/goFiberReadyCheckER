export default function PageHeader() {
  return (
    <div className="flex items-center gap-3">
      <span className="material-symbols-outlined text-red-500 text-4xl" style={{ fontVariationSettings: "'wght' 700" }}>
        local_shipping
      </span>
      <h1 className="text-3xl font-bold text-gray-800">ตรวจสอบรถ</h1>
    </div>
  );
}
