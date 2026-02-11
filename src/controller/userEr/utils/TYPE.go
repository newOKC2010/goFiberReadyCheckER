package listUtils

type StaffItem struct {
	ID       int64  `json:"id"`
	FullName string `json:"full_name"`
}

type ListStaffResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    []StaffItem `json:"data,omitempty"`
}
