package handlerUpdateParcelList

import "fmt"

func ValidateParcelListID(id int64) error {
	if id <= 0 {
		return fmt.Errorf("กรุณาระบุ parcel_list_id")
	}
	return nil
}

func ValidateName(name string) error {
	if name == "" {
		return fmt.Errorf("กรุณาระบุชื่อรายการตรวจสอบ")
	}
	return nil
}
