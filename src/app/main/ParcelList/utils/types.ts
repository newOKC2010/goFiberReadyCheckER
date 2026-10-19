export interface ParcelListItem {
  id: number;
  name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginationResponse {
  total_count: number;
  total_pages: number;
  current_page: number;
}
