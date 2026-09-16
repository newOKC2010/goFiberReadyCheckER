package handlerUpdateEmergency

import (
	"fmt"
	"regexp"
	"strings"
)

var validTypes = map[string]bool{
	"ALS": true,
	"BLS": true,
	"FR":  true,
}

func ValidateEmergencyID(id int64) error {
	if id <= 0 {
		return fmt.Errorf("emergency_id ไม่ถูกต้อง")
	}
	return nil
}

func ValidateLicensePlateName(name string) error {
	name = strings.TrimSpace(name)
	if strings.Contains(name, " ") {
		return fmt.Errorf("ทะเบียนรถไม่สามารถมีช่องว่างได้")
	}
	matched, _ := regexp.MatchString(`^[ก-๏0-9]+$`, name)
	if !matched {
		return fmt.Errorf("ทะเบียนรถต้องเป็นตัวอักษรไทยและตัวเลขเท่านั้น")
	}
	return nil
}

func ValidateType(t string) error {
	if !validTypes[strings.ToUpper(strings.TrimSpace(t))] {
		return fmt.Errorf("ประเภทรถไม่ถูกต้อง (ALS, BLS, FR)")
	}
	return nil
}
