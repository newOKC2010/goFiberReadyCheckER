package addUtils

type ChecklistItem struct {
	Name        string   `json:"name"`
	Note        string   `json:"note"`
	Status      bool     `json:"status"`
	Images      []string `json:"images"`
	ChecklistID string   `json:"checklist_id"`
}

type ChecklistItems struct {
	Items []ChecklistItem `json:"items"`
}

type AddCarCheckedRequest struct {
	CarID          int64  `form:"car_id"`
	ChecklistItems string `form:"checklist_items"`
}

type UploadResult struct {
	PhotoID      int64  `json:"photo_id"`
	FullPath     string `json:"full_path"`
	RelativePath string `json:"relative_path"`
}

type AddCarCheckedResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	ID      int64  `json:"id,omitempty"`
}
