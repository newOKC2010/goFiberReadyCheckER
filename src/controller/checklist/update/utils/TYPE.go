package updateChecklistUtils

type UpdateChecklistRequest struct {
	ChecklistID int64   `json:"checklist_id" form:"checklist_id"`
	Name        string  `json:"name" form:"name"`
	Role        *string `json:"role" form:"role"` // user | driver (optional)
	IsActive    *bool   `json:"is_active" form:"is_active"`
}

type UpdateChecklistResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}
