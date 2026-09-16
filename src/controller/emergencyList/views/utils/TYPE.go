package viewsEmergencyListUtils

import "time"

type EmergencyListResponse struct {
	ID          int64     `json:"id"`
	Name        string    `json:"name"`
	Description *string   `json:"description,omitempty"`
	IsActive    bool      `json:"is_active"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type ViewsEmergencyListResponse struct {
	Success     bool                    `json:"success"`
	Message     string                  `json:"message"`
	Data        []EmergencyListResponse `json:"data,omitempty"`
	TotalCount  int                     `json:"total_count,omitempty"`
	TotalPages  int                     `json:"total_pages,omitempty"`
	CurrentPage int                     `json:"current_page,omitempty"`
}
