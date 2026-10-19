package serviceDeleteParcelChecked

import (
	"context"
	"fmt"
	"time"

	modelParcel "go-fiber-check-ambu/src/database/models/parcel"

	"github.com/uptrace/bun"
)

func CheckParcelCheckedExists(ctx context.Context, db *bun.DB, id int64) (bool, error) {
	count, err := db.NewSelect().Model((*modelParcel.ParcelChecked)(nil)).
		Where("id = ?", id).Where("is_active = ?", true).Where("deleted_at IS NULL").Count(ctx)
	return count > 0, err
}

func SoftDeleteParcelChecked(ctx context.Context, db *bun.DB, id int64) error {
	now := time.Now()
	_, err := db.NewUpdate().Model((*modelParcel.ParcelChecked)(nil)).
		Set("deleted_at = ?", now).Set("is_active = ?", false).
		Where("id = ?", id).Where("deleted_at IS NULL").Exec(ctx)
	if err != nil {
		return fmt.Errorf("ลบข้อมูลไม่สำเร็จ")
	}
	return nil
}
