export interface ChecklistItem {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChecklistOption {
  value: string;
  label: string;
}

export interface PaginationResponse {
  total_count: number;
  total_pages: number;
  current_page: number;
}
