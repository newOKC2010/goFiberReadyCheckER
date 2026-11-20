package addChecklistUtils

type AddChecklistRequest struct {
	Name string `json:"name" form:"name"`
	Role string `json:"role" form:"role"` // user | driver (default: user)
}

type AddChecklistResponse struct {
	Success     bool   `json:"success"`
	Message     string `json:"message"`
	ChecklistID int64  `json:"checklist_id,omitempty"`
}
