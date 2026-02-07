package handlerAddCar

import (
	"fmt"
	"regexp"
	"strings"
)

func ValidateAdminRole(role string) error {
	if role != "admin" && role != "super_admin" {
		return fmt.Errorf("ไม่มีสิทธิ์เพิ่มรถ (เฉพาะ admin)")
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
