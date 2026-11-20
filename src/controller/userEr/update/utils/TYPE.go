package updateUtils

type UpdateStatusRequest struct {
	UserID int64  `json:"user_id"`
	Status bool   `json:"status"`
	Role   string `json:"role"` // ต้องระบุเมื่อ status = true (user / driver / admin)
}

type UpdateStatusResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}
