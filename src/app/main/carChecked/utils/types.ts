export interface ChecklistItem {
  name: string;
  note: string;
  status: boolean;
  images: string[];
  checklist_id: string;
}

export interface CarCheckedItem {
  id: number;
  license_plate_name: string;
  checked_date: string;
  checked_by: string;
  checklist_items: {
    items: ChecklistItem[];
  };
}

export interface CarOption {
  id: number;
  license_plate_name: string;
}

export interface StaffOption {
  id: number;
  full_name: string;
}

export interface FilterParams {
  date_from?: string;
  date_to?: string;
  car_id?: string;
  staff_id?: string;
}
