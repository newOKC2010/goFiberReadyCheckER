package serviceUpdateParcel

import (
	"context"
	"fmt"

	modelParcel "go-fiber-check-ambu/src/database/models/parcel"

	"github.com/uptrace/bun"
)

func CheckParcelExists(ctx context.Context, db *bun.DB, id int64) (bool, error) {
	count, err := db.NewSelect().Model((*modelParcel.Parcel)(nil)).Where("id = ?", id).Where("deleted_at IS NULL").Count(ctx)
	return count > 0, err
}

func CheckNameExists(ctx context.Context, db *bun.DB, name string, excludeID int64) (bool, error) {
	count, err := db.NewSelect().Model((*modelParcel.Parcel)(nil)).
		Where("name = ?", name).Where("id != ?", excludeID).Where("deleted_at IS NULL").Count(ctx)
	return count > 0, err
}

func UpdateParcel(ctx context.Context, db *bun.DB, id int64, name string, active *bool) error {
	query := db.NewUpdate().Model((*modelParcel.Parcel)(nil)).Where("id = ?", id).Where("deleted_at IS NULL")
	if name != "" {
		query = query.Set("name = ?", name)
	}
	if active != nil {
		query = query.Set("active = ?", *active)
	}
	query = query.Set("updated_at = NOW()")
	_, err := query.Exec(ctx)
	if err != nil {
		return fmt.Errorf("แก้ไขข้อมูลไม่สำเร็จ")
	}
	return nil
}
