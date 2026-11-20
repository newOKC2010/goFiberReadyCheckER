package listUtils

type StaffItem struct {
	ID       int64  `json:"id"`
	FullName string `json:"full_name"`
	Email    string `json:"email"`
	Role     string `json:"role"`
	Status   bool   `json:"status"`
}

type ListStaffResponse struct {
	Success     bool        `json:"success"`
	Message     string      `json:"message"`
	Data        []StaffItem `json:"data,omitempty"`
	TotalCount  int         `json:"total_count,omitempty"`
	TotalPages  int         `json:"total_pages,omitempty"`
	CurrentPage int         `json:"current_page,omitempty"`
}
