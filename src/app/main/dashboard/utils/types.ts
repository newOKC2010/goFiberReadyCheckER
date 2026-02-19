export interface CarReadiness {
  car_id: number;
  license_plate_name: string;
  total_items: number;
  passed_items: number;
  pass_percent: number;
  status: 'green' | 'yellow' | 'red' | 'unchecked';
  checked_record_id?: number;
}

export interface FailingItem {
  name: string;
  checklist_id: string;
  fail_count: number;
}

export interface UncheckedCar {
  car_id: number;
  license_plate_name: string;
}

export interface CheckerSummary {
  checked_by: string;
  count: number;
}

export interface DashboardData {
  success: boolean;
  message: string;
  fleet_readiness: CarReadiness[];
  top_failing_items: FailingItem[];
  unchecked_cars: UncheckedCar[];
  checker_summary: CheckerSummary[];
}
