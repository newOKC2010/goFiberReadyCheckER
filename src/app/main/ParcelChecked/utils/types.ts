export interface ChecklistItem {
  name: string;
  note: string;
  status: boolean;
  images: string[];
  checklist_id: string;
  item_type: string;
}

export interface ParcelCheckedItem {
  id: number;
  parcel_name: string;
  checked_date: string;
  checked_by: string;
  checklist_items: { items: ChecklistItem[] };
}

export interface ParcelOption {
  id: number;
  name: string;
}

export interface StaffOption {
  value: string;
  label: string;
}

export interface FilterParams {
  date_from?: string;
  date_to?: string;
  parcel_id?: string;
  staff_id?: string;
  offset?: number;
  limit?: number;
}

export interface PaginationResponse {
  total_count: number;
  total_pages: number;
  current_page: number;
}
