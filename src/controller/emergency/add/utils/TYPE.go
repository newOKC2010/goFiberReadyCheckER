package addEmergencyUtils

type AddEmergencyRequest struct {
	LicensePlateName string `json:"license_plate_name" form:"license_plate_name"`
	Type             string `json:"type" form:"type"`
}

type AddEmergencyResponse struct {
	Success     bool   `json:"success"`
	Message     string `json:"message"`
	EmergencyID int64  `json:"emergency_id,omitempty"`
}
