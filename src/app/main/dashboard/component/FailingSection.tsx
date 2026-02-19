import { FailingItem } from '@/app/main/dashboard/utils/types';

interface Props {
  data: FailingItem[];
}

export default function FailingSection({ data }: Props) {
  const max = data[0]?.fail_count ?? 1;

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-red-500">warning</span>
        <h2 className="text-lg font-bold text-gray-700">รายการที่ไม่ผ่านบ่อย</h2>
        <span className="ml-auto text-sm text-gray-400">top {data.length}</span>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {data.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">ไม่มีข้อมูล</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {data.map((item, i) => (
              <li key={item.checklist_id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors"
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0
                  ${i === 0 ? 'bg-red-500 text-white' : i === 1 ? 'bg-orange-400 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                    <div
                      className="h-1.5 rounded-full bg-red-400 transition-all"
                      style={{ width: `${(item.fail_count / max) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-black text-red-500 shrink-0">{item.fail_count}x</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
