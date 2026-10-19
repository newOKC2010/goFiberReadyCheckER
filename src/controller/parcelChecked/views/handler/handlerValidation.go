package handlerViewsParcelChecked

import (
	"fmt"
	"strconv"
	"time"

	viewsUtils "go-fiber-check-ambu/src/controller/parcelChecked/views/utils"
)

func ValidateFilters(filters viewsUtils.FilterParams) error {
	for _, df := range []struct{ label, val string }{{"date_from", filters.DateFrom}, {"date_to", filters.DateTo}} {
		if df.val != "" {
			if _, err := time.Parse("2006-01-02", df.val); err != nil {
				return fmt.Errorf("%s รูปแบบไม่ถูกต้อง (YYYY-MM-DD)", df.label)
			}
		}
	}
	if filters.DateFrom != "" && filters.DateTo != "" {
		from, _ := time.Parse("2006-01-02", filters.DateFrom)
		to, _ := time.Parse("2006-01-02", filters.DateTo)
		if from.After(to) {
			return fmt.Errorf("วันที่เริ่มต้นต้องไม่เกินวันที่สิ้นสุด")
		}
	}
	if filters.ParcelID != "" {
		if _, err := strconv.ParseInt(filters.ParcelID, 10, 64); err != nil {
			return fmt.Errorf("parcel_id ต้องเป็นตัวเลข")
		}
	}
	if filters.StaffID != "" {
		if _, err := strconv.ParseInt(filters.StaffID, 10, 64); err != nil {
			return fmt.Errorf("staff_id ต้องเป็นตัวเลข")
		}
	}
	return nil
}
