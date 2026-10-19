package updateParcelListUtils

type UpdateParcelListRequest struct {
	ParcelListID int64   `json:"parcel_list_id" form:"parcel_list_id"`
	Name         string  `json:"name" form:"name"`
	Description  *string `json:"description" form:"description"`
	ItemType     *string `json:"item_type" form:"item_type"`
	TrueLabel    *string `json:"true_label" form:"true_label"`
	FalseLabel   *string `json:"false_label" form:"false_label"`
	IsActive     *bool   `json:"is_active" form:"is_active"`
}

type UpdateParcelListResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}
