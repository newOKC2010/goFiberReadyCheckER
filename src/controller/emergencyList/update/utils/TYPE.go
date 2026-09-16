package updateEmergencyListUtils

type UpdateEmergencyListRequest struct {
	EmergencyListID int64   `json:"emergency_list_id" form:"emergency_list_id"`
	Name            string  `json:"name" form:"name"`
	Description     *string `json:"description" form:"description"`
	IsActive        *bool   `json:"is_active" form:"is_active"`
}

type UpdateEmergencyListResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}
