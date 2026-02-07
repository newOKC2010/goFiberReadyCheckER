package serviceAddCar

import (
	"context"
	"fmt"

	modelCheckAmbu "go-fiber-check-ambu/src/database/models/checkAmbu"

	"github.com/uptrace/bun"
)

func CheckCarExists(ctx context.Context, db *bun.DB, licensePlateName string) (bool, error) {
	count, err := db.NewSelect().
		Model((*modelCheckAmbu.Car)(nil)).
		Where("license_plate_name = ?", licensePlateName).
		Where("deleted_at IS NULL").
		Count(ctx)

	return count > 0, err
}

func CreateCar(ctx context.Context, db *bun.DB, licensePlateName string) (int64, error) {
	car := &modelCheckAmbu.Car{
		LicensePlateName: licensePlateName,
		Active:           true,
	}

	_, err := db.NewInsert().
		Model(car).
		Exec(ctx)

	if err != nil {
		return 0, fmt.Errorf("เพิ่มข้อมูลรถไม่สำเร็จ")
	}

	return car.ID, nil
}
