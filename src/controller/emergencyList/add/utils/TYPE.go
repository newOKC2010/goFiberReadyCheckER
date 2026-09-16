package addEmergencyListUtils

type AddEmergencyListRequest struct {
	Name        string  `json:"name" form:"name"`
	Description *string `json:"description" form:"description"`
}

type AddEmergencyListResponse struct {
	Success         bool   `json:"success"`
	Message         string `json:"message"`
	EmergencyListID int64  `json:"emergency_list_id,omitempty"`
}
