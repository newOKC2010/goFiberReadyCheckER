package handlerUpdateChecklist

import (
	"fmt"
	"strings"
)

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
