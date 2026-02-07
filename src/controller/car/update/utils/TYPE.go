package updateCarUtils

type UpdateCarRequest struct {
	CarID            int64  `json:"car_id" form:"car_id"`
	LicensePlateName string `json:"license_plate_name" form:"license_plate_name"`
	Active           *bool  `json:"active" form:"active"`
}

type UpdateCarResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}
