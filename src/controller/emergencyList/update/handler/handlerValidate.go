package handlerUpdateEmergencyList

import (
	"fmt"
	"strings"
)

func ValidateEmergencyListID(id int64) error {
	if id <= 0 {
		return fmt.Errorf("emergency_list_id ไม่ถูกต้อง")
	}
	return nil
}

func ValidateName(name string) error {
	if strings.TrimSpace(name) == "" {
		return fmt.Errorf("กรุณากรอกชื่อรายการตรวจสอบ")
	}
	return nil
}
