package viewsParcelCheckedUtils

type FilterParams struct {
	ID       string
	DateFrom string
	DateTo   string
	ParcelID string
	StaffID  string
	Offset   int
	Limit    int
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

type ParcelCheckedResponse struct {
	ID             int64          `json:"id"`
	ParcelName     string         `json:"parcel_name"`
	CheckedDate    string         `json:"checked_date"`
	CheckedBy      string         `json:"checked_by,omitempty"`
	ChecklistItems ChecklistItems `json:"checklist_items"`
}

type ViewParcelCheckedResponse struct {
	Success     bool                    `json:"success"`
	Message     string                  `json:"message"`
	Data        []ParcelCheckedResponse `json:"data,omitempty"`
	TotalCount  int                     `json:"total_count,omitempty"`
	TotalPages  int                     `json:"total_pages,omitempty"`
	CurrentPage int                     `json:"current_page,omitempty"`
}

type ParcelCheckedData struct {
	ID             int64   `bun:"id"`
	ParcelName     string  `bun:"parcel_name"`
	CheckedDate    string  `bun:"checked_date"`
	CheckedBy      *int64  `bun:"checked_by"`
	ChecklistItems []byte  `bun:"checklist_items,type:jsonb"`
	FullName       *string `bun:"full_name"`
}
