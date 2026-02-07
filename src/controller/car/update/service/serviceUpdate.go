package serviceUpdateCar

import (
	"context"
	"fmt"

	modelCheckAmbu "go-fiber-check-ambu/src/database/models/checkAmbu"

	"github.com/uptrace/bun"
)

func CheckCarExists(ctx context.Context, db *bun.DB, carID int64) (bool, error) {
	count, err := db.NewSelect().
		Model((*modelCheckAmbu.Car)(nil)).
		Where("id = ?", carID).
		Where("deleted_at IS NULL").
		Count(ctx)

	return count > 0, err
}

func CheckLicensePlateExists(ctx context.Context, db *bun.DB, licensePlateName string, excludeCarID int64) (bool, error) {
	count, err := db.NewSelect().
		Model((*modelCheckAmbu.Car)(nil)).
		Where("license_plate_name = ?", licensePlateName).
		Where("id != ?", excludeCarID).
		Where("deleted_at IS NULL").
		Count(ctx)

	return count > 0, err
}

func UpdateCar(ctx context.Context, db *bun.DB, carID int64, licensePlateName string, active *bool) error {
	query := db.NewUpdate().
		Model((*modelCheckAmbu.Car)(nil)).
		Where("id = ?", carID).
		Where("deleted_at IS NULL")

	if licensePlateName != "" {
		query = query.Set("license_plate_name = ?", licensePlateName)
	}

	if active != nil {
		query = query.Set("active = ?", *active)
	}

	_, err := query.Exec(ctx)
	if err != nil {
		return fmt.Errorf("แก้ไขข้อมูลไม่สำเร็จ")
	}

	return nil
}
