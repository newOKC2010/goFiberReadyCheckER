export default function PageHeader() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-3xl text-blue-600" style={{ fontVariationSettings: "'wght' 600" }}>manage_accounts</span>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">จัดการผู้ใช้งาน</h1>
          <p className="text-gray-500 text-sm font-bold">อนุมัติ / ระงับ / กำหนด role ผู้ใช้งานในระบบ</p>
        </div>
      </div>
    </div>
  );
}
