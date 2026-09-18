package serviceDeleteEmergencyChecked

import (
	"context"
	"fmt"
	"time"

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

func SoftDeleteEmergencyChecked(ctx context.Context, db *bun.DB, id int64) error {
	now := time.Now()
	_, err := db.NewUpdate().
		Model((*modelEmergency.EmergencyChecked)(nil)).
		Set("deleted_at = ?", now).
		Set("is_active = ?", false).
		Where("id = ?", id).
		Where("deleted_at IS NULL").
		Exec(ctx)

	if err != nil {
		return fmt.Errorf("ลบข้อมูลไม่สำเร็จ")
	}
	return nil
}
