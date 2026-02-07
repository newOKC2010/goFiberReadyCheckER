package handlerUpdateChecklist

import (
	"fmt"
	"strings"
)

func ValidateAdminRole(role string) error {
	if role != "admin" && role != "super_admin" {
		return fmt.Errorf("ไม่มีสิทธิ์แก้ไขข้อมูล (เฉพาะ admin)")
	}
	return nil
}

func ValidateChecklistID(checklistID int64) error {
	if checklistID <= 0 {
		return fmt.Errorf("checklist_id ไม่ถูกต้อง")
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
