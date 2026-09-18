package serviceUpdateEmergencyList

import (
	"context"
	"fmt"

	modelEmergency "go-fiber-check-ambu/src/database/models/emergency"

	"github.com/uptrace/bun"
)

func CheckEmergencyListExists(ctx context.Context, db *bun.DB, id int64) (bool, error) {
	count, err := db.NewSelect().
		Model((*modelEmergency.EmergencyList)(nil)).
		Where("id = ?", id).
		Where("deleted_at IS NULL").
		Count(ctx)

	return count > 0, err
}

func CheckNameExists(ctx context.Context, db *bun.DB, name string, excludeID int64) (bool, error) {
	count, err := db.NewSelect().
		Model((*modelEmergency.EmergencyList)(nil)).
		Where("name = ?", name).
		Where("id != ?", excludeID).
		Where("deleted_at IS NULL").
		Count(ctx)

	return count > 0, err
}

func UpdateEmergencyList(ctx context.Context, db *bun.DB, id int64, name string, description, itemType, trueLabel, falseLabel *string, isActive *bool) error {
	query := db.NewUpdate().
		Model((*modelEmergency.EmergencyList)(nil)).
		Where("id = ?", id).
		Where("deleted_at IS NULL").
		Set("name = ?", name).
		Set("updated_at = NOW()")

	if description != nil {
		query = query.Set("description = ?", *description)
	}
	if itemType != nil {
		query = query.Set("item_type = ?", *itemType)
	}
	if trueLabel != nil {
		query = query.Set("true_label = ?", *trueLabel)
	}
	if falseLabel != nil {
		query = query.Set("false_label = ?", *falseLabel)
	}
	if isActive != nil {
		query = query.Set("is_active = ?", *isActive)
	}

	_, err := query.Exec(ctx)
	if err != nil {
		return fmt.Errorf("แก้ไขข้อมูลไม่สำเร็จ")
	}

	return nil
}
