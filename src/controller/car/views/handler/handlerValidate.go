package handlerViewsCar

import "fmt"

func ValidateAdminRole(role string) error {
	if role != "admin" && role != "super_admin" {
		return fmt.Errorf("ไม่มีสิทธิ์เข้าถึงข้อมูล (เฉพาะ admin)")
	}
	return nil
}
