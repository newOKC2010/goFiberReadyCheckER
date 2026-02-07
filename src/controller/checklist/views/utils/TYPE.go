package viewsChecklistUtils

import "time"

type ChecklistResponse struct {
	ID        int64     `json:"id"`
	Name      string    `json:"name"`
	IsActive  bool      `json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type ViewsChecklistsResponse struct {
	Success bool                `json:"success"`
	Message string              `json:"message"`
	Data    []ChecklistResponse `json:"data,omitempty"`
}
