export interface CarItem {
  id: number;
  license_plate_name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginationResponse {
  total_count: number;
  total_pages: number;
  current_page: number;
}
