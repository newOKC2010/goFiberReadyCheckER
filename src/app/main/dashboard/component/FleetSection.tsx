import { CarReadiness } from '@/app/main/dashboard/utils/types';

const statusConfig = {
  green:     { label: 'ผ่านทั้งหมด', bg: 'bg-green-50',  border: 'border-green-200', text: 'text-green-700',  badge: 'bg-green-100 text-green-700',  dot: 'bg-green-500'  },
  yellow:    { label: 'ผ่านบางส่วน', bg: 'bg-yellow-50', border: 'border-yellow-200',text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  red:       { label: 'ต้องแก้ไข',   bg: 'bg-red-50',    border: 'border-red-200',   text: 'text-red-700',   badge: 'bg-red-100 text-red-700',      dot: 'bg-red-500'    },
  unchecked: { label: 'ยังไม่ตรวจ',  bg: 'bg-gray-50',   border: 'border-gray-200',  text: 'text-gray-500',  badge: 'bg-gray-100 text-gray-500',    dot: 'bg-gray-400'   },
};

interface Props {
  data: CarReadiness[];
}

export default function FleetSection({ data }: Props) {
  const counts = {
    green:     data.filter(c => c.status === 'green').length,
    yellow:    data.filter(c => c.status === 'yellow').length,
    red:       data.filter(c => c.status === 'red').length,
    unchecked: data.filter(c => c.status === 'unchecked').length,
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-blue-500">local_hospital</span>
        <h2 className="text-lg font-bold text-gray-700">ความพร้อมรถพยาบาล</h2>
        <span className="ml-auto text-sm text-gray-400">{data.length} คัน</span>
      </div>

      {/* Summary badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(Object.keys(counts) as (keyof typeof counts)[]).map(key => (
          <span key={key} className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${statusConfig[key].badge}`}>
            <span className={`w-2 h-2 rounded-full ${statusConfig[key].dot}`} />
            {statusConfig[key].label} {counts[key]}
          </span>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map(car => {
          const cfg = statusConfig[car.status];
          return (
            <div key={car.car_id}
              className={`${cfg.bg} border ${cfg.border} rounded-2xl p-4 cursor-pointer
                active:scale-95 hover:shadow-md transition-all select-none`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-gray-800 text-base">{car.license_plate_name}</p>
                  <span className={`text-xs font-semibold ${cfg.badge} px-2 py-0.5 rounded-full`}>
                    {cfg.label}
                  </span>
                </div>
                <span className={`text-2xl font-black ${cfg.text}`}>
                  {car.status === 'unchecked' ? '—' : `${car.pass_percent}%`}
                </span>
              </div>

              {car.status !== 'unchecked' && (
                <div>
                  <div className="w-full bg-white rounded-full h-2 mb-1">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        car.status === 'green' ? 'bg-green-500' :
                        car.status === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${car.pass_percent}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">{car.passed_items}/{car.total_items} รายการ</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
