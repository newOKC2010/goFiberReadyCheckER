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

func CreateEmergencyList(ctx context.Context, db *bun.DB, name string, description *string) (int64, error) {
	item := &modelEmergency.EmergencyList{
		Name:        name,
		Description: description,
		IsActive:    true,
	}

	_, err := db.NewInsert().Model(item).Exec(ctx)
	if err != nil {
		return 0, fmt.Errorf("เพิ่มรายการตรวจสอบไม่สำเร็จ")
	}

	return item.ID, nil
}
