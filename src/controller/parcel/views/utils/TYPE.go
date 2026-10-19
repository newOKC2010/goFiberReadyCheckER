package viewsParcelUtils

import "time"

type ParcelResponse struct {
	ID        int64     `json:"id"`
	Name      string    `json:"name"`
	Active    bool      `json:"active"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type ViewsParcelResponse struct {
	Success     bool             `json:"success"`
	Message     string           `json:"message"`
	Data        []ParcelResponse `json:"data,omitempty"`
	TotalCount  int              `json:"total_count,omitempty"`
	TotalPages  int              `json:"total_pages,omitempty"`
	CurrentPage int              `json:"current_page,omitempty"`
}
