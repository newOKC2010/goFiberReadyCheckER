package serviceUpdateEmergencyChecked

import (
	"context"

	modelEmergency "go-fiber-check-ambu/src/database/models/emergency"

	"github.com/uptrace/bun"
)

func CheckEmergencyCheckedExists(ctx context.Context, db *bun.DB, id int64) (bool, error) {
	count, err := db.NewSelect().
		Model((*modelEmergency.EmergencyChecked)(nil)).
		Where("id = ?", id).
		Where("is_active = ?", true).
		Where("deleted_at IS NULL").
		Count(ctx)

	return count > 0, err
}

func CheckUpdatePermission(ctx context.Context, db *bun.DB, id int64, userID int64, role string) (bool, error) {
	if role == "admin" || role == "super_admin" {
		return true, nil
	}

	count, err := db.NewSelect().
		Model((*modelEmergency.EmergencyChecked)(nil)).
		Where("id = ?", id).
		Where("checked_by = ?", userID).
		Where("is_active = ?", true).
		Where("deleted_at IS NULL").
		Count(ctx)

	return count > 0, err
}
