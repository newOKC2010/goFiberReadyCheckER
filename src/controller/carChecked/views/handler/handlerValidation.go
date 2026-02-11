package handlerViews

import (
	"fmt"
	"strconv"
	"time"

	viewsUtils "go-fiber-check-ambu/src/controller/carChecked/views/utils"
)

func ValidateFilters(filters viewsUtils.FilterParams) error {
	if filters.DateFrom != "" {
		if _, err := time.Parse("2006-01-02", filters.DateFrom); err != nil {
			return fmt.Errorf("date_from รูปแบบไม่ถูกต้อง (YYYY-MM-DD)")
		}
	}

	if filters.DateTo != "" {
		if _, err := time.Parse("2006-01-02", filters.DateTo); err != nil {
			return fmt.Errorf("date_to รูปแบบไม่ถูกต้อง (YYYY-MM-DD)")
		}
	}

	if filters.DateFrom != "" && filters.DateTo != "" {
		from, _ := time.Parse("2006-01-02", filters.DateFrom)
		to, _ := time.Parse("2006-01-02", filters.DateTo)
		if from.After(to) {
			return fmt.Errorf("วันที่เริ่มต้นต้องไม่เกินวันที่สิ้นสุด")
		}
	}

	if filters.CarID != "" {
		if _, err := strconv.ParseInt(filters.CarID, 10, 64); err != nil {
			return fmt.Errorf("car_id ต้องเป็นตัวเลข")
		}
	}

	if filters.StaffID != "" {
		if _, err := strconv.ParseInt(filters.StaffID, 10, 64); err != nil {
			return fmt.Errorf("staff_id ต้องเป็นตัวเลข")
		}
	}

	return nil
}
