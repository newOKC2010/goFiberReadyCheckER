import { UncheckedCar, CheckerSummary } from '@/app/main/dashboard/utils/types';

interface Props {
  uncheckedCars: UncheckedCar[];
  checkerSummary: CheckerSummary[];
}

export default function ComplianceSection({ uncheckedCars, checkerSummary }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* รถที่ยังไม่ตรวจ */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-orange-500">directions_car</span>
          <h2 className="text-lg font-bold text-gray-700">ยังไม่ตรวจวันนี้</h2>
          <span className="ml-auto bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">
            {uncheckedCars.length} คัน
          </span>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          {uncheckedCars.length === 0 ? (
            <div className="flex flex-col items-center py-8 gap-1">
              <span className="material-symbols-outlined text-green-400 text-4xl">check_circle</span>
              <p className="text-sm text-green-600 font-semibold">ตรวจครบทุกคันแล้ว</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {uncheckedCars.map(car => (
                <li key={car.car_id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-orange-400 text-xl">ambulance</span>
                  <span className="text-sm font-semibold text-gray-800">{car.license_plate_name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ผู้ตรวจวันนี้ */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-blue-500">person_check</span>
          <h2 className="text-lg font-bold text-gray-700">ผู้ตรวจวันนี้</h2>
          <span className="ml-auto bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
            {checkerSummary.length} คน
          </span>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          {checkerSummary.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">ยังไม่มีการตรวจวันนี้</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {checkerSummary.map((c, i) => (
                <li key={i}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-blue-400 text-xl">account_circle</span>
                  <span className="flex-1 text-sm font-semibold text-gray-800">{c.checked_by}</span>
                  <span className="bg-blue-50 text-blue-600 text-xs font-black px-2 py-1 rounded-lg">{c.count} คัน</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
