package deleteParcelCheckedUtils

type DeleteParcelCheckedRequest struct {
	ParcelCheckedID int64 `json:"parcel_checked_id" form:"parcel_checked_id"`
}

type DeleteParcelCheckedResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}
