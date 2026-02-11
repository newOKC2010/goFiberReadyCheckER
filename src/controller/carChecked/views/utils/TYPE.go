package viewsUtils

type FilterParams struct {
	DateFrom string `json:"date_from"`
	DateTo   string `json:"date_to"`
	CarID    string `json:"car_id"`
	StaffID  string `json:"staff_id"`
}

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

type CarCheckedResponse struct {
	ID               int64          `json:"id"`
	LicensePlateName string         `json:"license_plate_name"`
	CheckedDate      string         `json:"checked_date"`
	CheckedBy        string         `json:"checked_by,omitempty"`
	ChecklistItems   ChecklistItems `json:"checklist_items"`
}

type ViewCarCheckedResponse struct {
	Success bool                 `json:"success"`
	Message string               `json:"message"`
	Data    []CarCheckedResponse `json:"data,omitempty"`
}

type CarCheckedData struct {
	ID               int64   `bun:"id"`
	LicensePlateName string  `bun:"license_plate_name"`
	CheckedDate      string  `bun:"checked_date"`
	CheckedBy        *int64  `bun:"checked_by"`
	ChecklistItems   []byte  `bun:"checklist_items,type:jsonb"`
	FullName         *string `bun:"full_name"`
}
