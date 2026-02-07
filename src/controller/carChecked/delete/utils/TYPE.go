package deleteUtils

type DeleteCarCheckedRequest struct {
	CarCheckedID int64 `json:"car_checked_id" form:"car_checked_id"`
}

type DeleteCarCheckedResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}
