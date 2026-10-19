package addParcelUtils

type AddParcelRequest struct {
	Name string `json:"name" form:"name"`
}

type AddParcelResponse struct {
	Success  bool   `json:"success"`
	Message  string `json:"message"`
	ParcelID int64  `json:"parcel_id,omitempty"`
}
