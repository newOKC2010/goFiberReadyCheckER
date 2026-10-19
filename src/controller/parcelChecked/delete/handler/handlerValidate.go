package handlerDeleteParcelChecked

import "fmt"

func ValidateParcelCheckedID(id int64) error {
	if id <= 0 {
		return fmt.Errorf("parcel_checked_id ไม่ถูกต้อง")
	}
	return nil
}

func ValidateAdminRole(role string) error {
	if role != "admin" && role != "super_admin" {
		return fmt.Errorf("ไม่มีสิทธิ์ลบข้อมูล (เฉพาะ admin)")
	}
	return nil
}
