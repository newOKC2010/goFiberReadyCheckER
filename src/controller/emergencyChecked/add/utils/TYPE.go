package addEmergencyCheckedUtils

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

type AddEmergencyCheckedRequest struct {
	EmergencyID    int64  `form:"emergency_id"`
	ChecklistItems string `form:"checklist_items"`
}

type UploadResult struct {
	FullPath     string `json:"full_path"`
	RelativePath string `json:"relative_path"`
}

type AddEmergencyCheckedResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	ID      int64  `json:"id,omitempty"`
}
