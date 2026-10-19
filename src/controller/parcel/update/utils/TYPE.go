package updateParcelUtils

type UpdateParcelRequest struct {
	ParcelID int64  `json:"parcel_id" form:"parcel_id"`
	Name     string `json:"name" form:"name"`
	Active   *bool  `json:"active" form:"active"`
}

type UpdateParcelResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}
