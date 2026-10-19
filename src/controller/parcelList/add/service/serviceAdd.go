package serviceAddParcelList

import (
	"context"
	"fmt"

	modelParcel "go-fiber-check-ambu/src/database/models/parcel"

	"github.com/uptrace/bun"
)

func CheckParcelListExists(ctx context.Context, db *bun.DB, name string) (bool, error) {
	count, err := db.NewSelect().Model((*modelParcel.ParcelList)(nil)).
		Where("name = ?", name).Where("deleted_at IS NULL").Count(ctx)
	return count > 0, err
}

func CreateParcelList(ctx context.Context, db *bun.DB, name string, description *string, itemType, trueLabel, falseLabel string) (int64, error) {
	if itemType == "" {
		itemType = "boolean"
	}
	if trueLabel == "" {
		trueLabel = "มี"
	}
	if falseLabel == "" {
		falseLabel = "ไม่มี"
	}
	item := &modelParcel.ParcelList{
		Name: name, Description: description,
		ItemType: itemType, TrueLabel: trueLabel, FalseLabel: falseLabel, IsActive: true,
	}
	_, err := db.NewInsert().Model(item).Exec(ctx)
	if err != nil {
		return 0, fmt.Errorf("เพิ่มรายการตรวจสอบไม่สำเร็จ")
	}
	return item.ID, nil
}
