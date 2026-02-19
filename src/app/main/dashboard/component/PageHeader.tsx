interface Props {
  onReload: () => void;
  loading: boolean;
}

export default function PageHeader({ onReload, loading }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-blue-600 text-3xl">dashboard</span>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>
      <button
        onClick={onReload}
        disabled={loading}
        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-blue-50 text-blue-600 font-semibold text-sm
          hover:bg-blue-100 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
      >
        <span 
          className={`material-symbols-outlined text-base ${loading ? 'animate-spin' : ''}`}
          style={{
            fontVariationSettings: "'wght' 700",
            fontSize: 'clamp(1rem, 5vw, 1.5rem)',
            transition: 'all 0.3s ease'
          }}
        >
          refresh
        </span>
        รีเฟรช
      </button>
    </div>
  );
}
