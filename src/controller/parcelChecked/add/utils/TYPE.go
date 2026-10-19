package addParcelCheckedUtils

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

type AddParcelCheckedRequest struct {
	ParcelID       int64  `form:"parcel_id"`
	ChecklistItems string `form:"checklist_items"`
}

type UploadResult struct {
	FullPath     string
	RelativePath string
}

type AddParcelCheckedResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	ID      int64  `json:"id,omitempty"`
}
