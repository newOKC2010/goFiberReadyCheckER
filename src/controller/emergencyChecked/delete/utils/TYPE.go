package deleteEmergencyCheckedUtils

type DeleteEmergencyCheckedRequest struct {
	EmergencyCheckedID int64 `json:"emergency_checked_id" form:"emergency_checked_id"`
}

type DeleteEmergencyCheckedResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}
