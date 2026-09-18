package serviceAddEmergencyList

import (
	"context"
	"fmt"

	modelEmergency "go-fiber-check-ambu/src/database/models/emergency"

	"github.com/uptrace/bun"
)

func CheckEmergencyListExists(ctx context.Context, db *bun.DB, name string) (bool, error) {
	count, err := db.NewSelect().
		Model((*modelEmergency.EmergencyList)(nil)).
		Where("name = ?", name).
		Where("deleted_at IS NULL").
		Count(ctx)

	return count > 0, err
}

func CreateEmergencyList(ctx context.Context, db *bun.DB, name string, description *string, itemType, trueLabel, falseLabel string) (int64, error) {
	if itemType == "" {
		itemType = "boolean"
	}
	if trueLabel == "" {
		trueLabel = "มี"
	}
	if falseLabel == "" {
		falseLabel = "ไม่มี"
	}
	item := &modelEmergency.EmergencyList{
		Name:        name,
		Description: description,
		ItemType:    itemType,
		TrueLabel:   trueLabel,
		FalseLabel:  falseLabel,
		IsActive:    true,
	}

	_, err := db.NewInsert().Model(item).Exec(ctx)
	if err != nil {
		return 0, fmt.Errorf("เพิ่มรายการตรวจสอบไม่สำเร็จ")
	}

	return item.ID, nil
}
