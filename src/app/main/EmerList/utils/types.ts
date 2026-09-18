export interface EmerListItem {
  id: number;
  license_plate_name: string;
  type: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginationResponse {
  total_count: number;
  total_pages: number;
  current_page: number;
}
