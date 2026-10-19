package serviceUpdateParcelChecked

import (
	"context"

	modelParcel "go-fiber-check-ambu/src/database/models/parcel"

	"github.com/uptrace/bun"
)

func CheckParcelCheckedExists(ctx context.Context, db *bun.DB, id int64) (bool, error) {
	count, err := db.NewSelect().Model((*modelParcel.ParcelChecked)(nil)).
		Where("id = ?", id).Where("is_active = ?", true).Where("deleted_at IS NULL").Count(ctx)
	return count > 0, err
}

func CheckUpdatePermission(ctx context.Context, db *bun.DB, id int64, userID int64, role string) (bool, error) {
	if role == "admin" || role == "super_admin" {
		return true, nil
	}
	count, err := db.NewSelect().Model((*modelParcel.ParcelChecked)(nil)).
		Where("id = ?", id).Where("checked_by = ?", userID).
		Where("is_active = ?", true).Where("deleted_at IS NULL").Count(ctx)
	return count > 0, err
}
