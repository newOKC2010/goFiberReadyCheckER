package addParcelListUtils

type AddParcelListRequest struct {
	Name        string  `json:"name" form:"name"`
	Description *string `json:"description" form:"description"`
	ItemType    string  `json:"item_type" form:"item_type"`
	TrueLabel   string  `json:"true_label" form:"true_label"`
	FalseLabel  string  `json:"false_label" form:"false_label"`
}

type AddParcelListResponse struct {
	Success      bool   `json:"success"`
	Message      string `json:"message"`
	ParcelListID int64  `json:"parcel_list_id,omitempty"`
}
