package viewsEmergencyUtils

import "time"

type EmergencyResponse struct {
	ID               int64     `json:"id"`
	LicensePlateName string    `json:"license_plate_name"`
	Type             string    `json:"type"`
	Active           bool      `json:"active"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type ViewsEmergencyResponse struct {
	Success     bool                `json:"success"`
	Message     string              `json:"message"`
	Data        []EmergencyResponse `json:"data,omitempty"`
	TotalCount  int                 `json:"total_count,omitempty"`
	TotalPages  int                 `json:"total_pages,omitempty"`
	CurrentPage int                 `json:"current_page,omitempty"`
}
