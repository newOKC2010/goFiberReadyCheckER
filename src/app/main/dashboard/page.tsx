'use client';

import PageHeader from '@/app/main/dashboard/component/PageHeader';
import FleetSection from '@/app/main/dashboard/component/FleetSection';
import FailingSection from '@/app/main/dashboard/component/FailingSection';
import ComplianceSection from '@/app/main/dashboard/component/ComplianceSection';
import { useDashboardData } from '@/app/main/dashboard/hooks/useDashboardData';

export default function DashboardPage() {
  const { data, loading, reload } = useDashboardData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <PageHeader onReload={reload} loading={loading} />

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <span className="material-symbols-outlined text-blue-400 text-5xl animate-spin">progress_activity</span>
          </div>
        ) : (
          <>
            <FleetSection data={data.fleet_readiness} />
            <FailingSection data={data.top_failing_items} />
            <ComplianceSection
              uncheckedCars={data.unchecked_cars}
              checkerSummary={data.checker_summary}
            />
          </>
        )}
      </div>
    </div>
  );
}
