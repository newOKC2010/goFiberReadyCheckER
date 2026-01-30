package serviceUpdate

import (
	"context"
	modelCheckAmbu "go-fiber-check-ambu/src/database/models/checkAmbu"

	"github.com/uptrace/bun"
)

func CheckCarCheckedExists(ctx context.Context, db *bun.DB, carCheckedID int64) (bool, error) {
	count, err := db.NewSelect().
		Model((*modelCheckAmbu.CarChecked)(nil)).
		Where("id = ?", carCheckedID).
		Where("is_active = ?", true).
		Where("deleted_at IS NULL").
		Count(ctx)

	return count > 0, err
}

func CheckUpdatePermission(ctx context.Context, db *bun.DB, carCheckedID int64, userID int64, role string) (bool, error) {
	if role == "admin" || role == "super_admin" {
		return true, nil
	}

	count, err := db.NewSelect().
		Model((*modelCheckAmbu.CarChecked)(nil)).
		Where("id = ?", carCheckedID).
		Where("checked_by = ?", userID).
		Where("is_active = ?", true).
		Where("deleted_at IS NULL").
		Count(ctx)

	return count > 0, err
}
