package updateChecklistUtils

type UpdateChecklistRequest struct {
	ChecklistID int64   `json:"checklist_id" form:"checklist_id"`
	Name        string  `json:"name" form:"name"`
	Description *string `json:"description" form:"description"`
	IsActive    *bool   `json:"is_active" form:"is_active"`
}

type UpdateChecklistResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}
