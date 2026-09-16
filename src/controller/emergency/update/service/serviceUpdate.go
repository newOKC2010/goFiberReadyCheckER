package serviceUpdateEmergency

import (
	"context"
	"fmt"
	"strings"

	modelEmergency "go-fiber-check-ambu/src/database/models/emergency"

	"github.com/uptrace/bun"
)

func CheckEmergencyExists(ctx context.Context, db *bun.DB, id int64) (bool, error) {
	count, err := db.NewSelect().
		Model((*modelEmergency.Emergency)(nil)).
		Where("id = ?", id).
		Where("deleted_at IS NULL").
		Count(ctx)

	return count > 0, err
}

func CheckLicensePlateExists(ctx context.Context, db *bun.DB, licensePlateName string, excludeID int64) (bool, error) {
	count, err := db.NewSelect().
		Model((*modelEmergency.Emergency)(nil)).
		Where("license_plate_name = ?", licensePlateName).
		Where("id != ?", excludeID).
		Where("deleted_at IS NULL").
		Count(ctx)

	return count > 0, err
}

func UpdateEmergency(ctx context.Context, db *bun.DB, id int64, licensePlateName, emergencyType string, active *bool) error {
	query := db.NewUpdate().
		Model((*modelEmergency.Emergency)(nil)).
		Where("id = ?", id).
		Where("deleted_at IS NULL")

	if licensePlateName != "" {
		query = query.Set("license_plate_name = ?", licensePlateName)
	}
	if t := strings.ToUpper(strings.TrimSpace(emergencyType)); t != "" {
		query = query.Set("type = ?", t)
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
