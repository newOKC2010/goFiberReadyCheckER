package handlerAddChecklist

import (
	"fmt"
	"strings"
)

func ValidateAdminRole(role string) error {
	if role != "admin" && role != "super_admin" {
		return fmt.Errorf("ไม่มีสิทธิ์เพิ่มรายการตรวจสอบ (เฉพาะ admin)")
	}
	return nil
}

func ValidateName(name string) error {
	name = strings.TrimSpace(name)
	if name == "" {
		return fmt.Errorf("กรุณากรอกชื่อรายการตรวจสอบ")
	}
	return nil
}
