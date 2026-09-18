export interface EmerChecklistItem {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  item_type: string;
  true_label: string;
  false_label: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationResponse {
  total_count: number;
  total_pages: number;
  current_page: number;
}
