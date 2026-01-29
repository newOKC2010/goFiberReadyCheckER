package handlerAdd

import (
	"context"
	"fmt"

	serviceAdd "go-fiber-check-ambu/src/controller/carChecked/add/service"
	addUtils "go-fiber-check-ambu/src/controller/carChecked/add/utils"

	"github.com/uptrace/bun"
)

func ValidateCarID(carID int64) error {
	if carID <= 0 {
		return fmt.Errorf("กรุณาระบุ car_id")
	}
	return nil
}

func ValidateChecklistItems(items *addUtils.ChecklistItems) error {
	if items == nil || len(items.Items) == 0 {
		return fmt.Errorf("กรุณาระบุรายการตรวจสอบ")
	}

	for i, item := range items.Items {
		if item.Name == "" {
			return fmt.Errorf("รายการที่ %d: ต้องระบุชื่อรายการ", i+1)
		}
		if item.ChecklistID == "" {
			return fmt.Errorf("รายการที่ %d: ต้องระบุ checklist_id", i+1)
		}
	}

	return nil
}

func ValidateCarNotCheckedToday(ctx context.Context, db *bun.DB, carID int64) error {
	exists, err := serviceAdd.CheckCarAlreadyCheckedToday(ctx, db, carID)
	if err != nil {
		return fmt.Errorf("ตรวจสอบข้อมูลไม่สำเร็จ")
	}
	if exists {
		return fmt.Errorf("รถคันนี้มีการตรวจสอบในวันนี้แล้ว")
	}
	return nil
}
