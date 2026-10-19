package handlerAddParcel

import (
	"fmt"
	"strings"
)

func ValidateName(name string) error {
	if strings.TrimSpace(name) == "" {
		return fmt.Errorf("กรุณาระบุชื่อพัสดุ")
	}
	return nil
}
