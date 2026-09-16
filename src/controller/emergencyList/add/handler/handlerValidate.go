package handlerAddEmergencyList

import (
	"fmt"
	"strings"
)

func ValidateName(name string) error {
	if strings.TrimSpace(name) == "" {
		return fmt.Errorf("กรุณากรอกชื่อรายการตรวจสอบ")
	}
	return nil
}
