export interface UserItem {
  id: number;
  full_name: string;
  email: string;
  role: string;
  status: boolean;
}

export interface PaginationResponse {
  total_count: number;
  total_pages: number;
  current_page: number;
}
