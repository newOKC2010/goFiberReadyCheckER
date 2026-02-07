package viewsCarUtils

import "time"

type CarResponse struct {
	ID               int64     `json:"id"`
	LicensePlateName string    `json:"license_plate_name"`
	Active           bool      `json:"active"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type ViewsCarsResponse struct {
	Success bool          `json:"success"`
	Message string        `json:"message"`
	Data    []CarResponse `json:"data,omitempty"`
}
