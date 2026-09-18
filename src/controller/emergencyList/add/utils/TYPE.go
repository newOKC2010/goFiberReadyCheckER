package addEmergencyListUtils

type AddEmergencyListRequest struct {
	Name        string  `json:"name" form:"name"`
	Description *string `json:"description" form:"description"`
	ItemType    string  `json:"item_type" form:"item_type"`   // boolean | text
	TrueLabel   string  `json:"true_label" form:"true_label"` // ใช้เมื่อ item_type = boolean
	FalseLabel  string  `json:"false_label" form:"false_label"`
}

type AddEmergencyListResponse struct {
	Success         bool   `json:"success"`
	Message         string `json:"message"`
	EmergencyListID int64  `json:"emergency_list_id,omitempty"`
}
