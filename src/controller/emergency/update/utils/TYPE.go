package updateEmergencyUtils

type UpdateEmergencyRequest struct {
	EmergencyID      int64  `json:"emergency_id" form:"emergency_id"`
	LicensePlateName string `json:"license_plate_name" form:"license_plate_name"`
	Type             string `json:"type" form:"type"`
	Active           *bool  `json:"active" form:"active"`
}

type UpdateEmergencyResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}
