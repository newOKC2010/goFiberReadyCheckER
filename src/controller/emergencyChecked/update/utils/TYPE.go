package updateEmergencyCheckedUtils

type UpdateChecklistItemRequest struct {
	EmergencyCheckedID int64  `form:"emergency_checked_id" json:"emergency_checked_id"`
	ChecklistID        string `form:"checklist_id" json:"checklist_id"`
	Note               string `form:"note" json:"note"`
	Status             bool   `form:"status" json:"status"`
}

type UpdateResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type ChecklistItem struct {
	Name        string   `json:"name"`
	Note        string   `json:"note"`
	Status      bool     `json:"status"`
	Images      []string `json:"images"`
	ChecklistID string   `json:"checklist_id"`
	ItemType    string   `json:"item_type"`
}

type ChecklistItems struct {
	Items []ChecklistItem `json:"items"`
}
