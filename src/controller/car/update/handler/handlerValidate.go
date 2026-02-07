package handlerUpdateCar

import (
	"fmt"
	"regexp"
	"strings"
)

func ValidateAdminRole(role string) error {
	if role != "admin" && role != "super_admin" {
		return fmt.Errorf("ไม่มีสิทธิ์แก้ไขข้อมูล (เฉพาะ admin)")
	}
	return nil
}

func ValidateCarID(carID int64) error {
	if carID <= 0 {
		return fmt.Errorf("car_id ไม่ถูกต้อง")
	}
	return nil
}

func ValidateLicensePlateName(name string) error {
	name = strings.TrimSpace(name)

	if name == "" {
		return fmt.Errorf("กรุณากระบุทะเบียนรถ")
	}

	if strings.Contains(name, " ") {
		return fmt.Errorf("ทะเบียนรถไม่สามารถมีช่องว่างได้")
	}

	matched, _ := regexp.MatchString(`^[ก-๏0-9]+$`, name)
	if !matched {
		return fmt.Errorf("ทะเบียนรถต้องเป็นตัวอักษรไทยและตัวเลขเท่านั้น")
	}

	return nil
}
