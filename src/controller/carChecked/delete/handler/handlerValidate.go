package handlerDelete

import (
	"fmt"
)

func ValidateCarCheckedID(carCheckedID int64) error {
	if carCheckedID <= 0 {
		return fmt.Errorf("car_checked_id ไม่ถูกต้อง")
	}
	return nil
}

func ValidateAdminRole(role string) error {
	if role != "admin" && role != "super_admin" {
		return fmt.Errorf("ไม่มีสิทธิ์ลบข้อมูล (เฉพาะ admin)")
	}
	return nil
}
