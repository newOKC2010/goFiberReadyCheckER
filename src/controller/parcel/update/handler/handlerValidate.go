package handlerUpdateParcel

import (
	"fmt"
	"strings"
)

func ValidateParcelID(id int64) error {
	if id <= 0 {
		return fmt.Errorf("กรุณาระบุ parcel_id")
	}
	return nil
}

func ValidateName(name string) error {
	if strings.TrimSpace(name) == "" {
		return fmt.Errorf("กรุณาระบุชื่อพัสดุ")
	}
	return nil
}
