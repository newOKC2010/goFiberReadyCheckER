package handlerAddParcelList

import "fmt"

func ValidateName(name string) error {
	if name == "" {
		return fmt.Errorf("กรุณาระบุชื่อรายการตรวจสอบ")
	}
	return nil
}
