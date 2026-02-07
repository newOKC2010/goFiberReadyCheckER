package addCarUtils

type AddCarRequest struct {
	LicensePlateName string `json:"license_plate_name" form:"license_plate_name"`
}

type AddCarResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	CarID   int64  `json:"car_id,omitempty"`
}
