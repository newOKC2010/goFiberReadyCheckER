package serviceDelete

import (
	"context"
	"fmt"
	"time"

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

func SoftDeleteCarChecked(ctx context.Context, db *bun.DB, carCheckedID int64) error {
	now := time.Now()
	_, err := db.NewUpdate().
		Model((*modelCheckAmbu.CarChecked)(nil)).
		Set("deleted_at = ?", now).
		Set("is_active = ?", false).
		Where("id = ?", carCheckedID).
		Where("deleted_at IS NULL").
		Exec(ctx)

	if err != nil {
		return fmt.Errorf("ลบข้อมูลไม่สำเร็จ")
	}

	return nil
}
