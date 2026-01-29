package serviceAdd

import (
	"context"
	"fmt"

	modelCheckAmbu "go-fiber-check-ambu/src/database/models/checkAmbu"

	"github.com/uptrace/bun"
)

func GetCarByID(ctx context.Context, db *bun.DB, carID int64) (*modelCheckAmbu.Car, error) {
	fmt.Printf("🔍 ค้นหารถ ID: %d", carID)

	car := new(modelCheckAmbu.Car)
	err := db.NewSelect().
		Model(car).
		Where("id = ?", carID).
		Where("active = ?", true).
		Where("deleted_at IS NULL").
		Scan(ctx)

	if err != nil {

		return nil, fmt.Errorf("ไม่พบข้อมูลรถ ID: %d", carID)
	}

	return car, nil
}

func CheckCarAlreadyCheckedToday(ctx context.Context, db *bun.DB, carID int64) (bool, error) {
	count, err := db.NewSelect().
		Model((*modelCheckAmbu.CarChecked)(nil)).
		Where("car_id = ?", carID).
		Where("DATE(checked_date) = CURRENT_DATE").
		Where("is_active = ?", true).
		Where("deleted_at IS NULL").
		Count(ctx)

	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func CreateCarChecked(ctx context.Context, db *bun.DB, carID int64, licensePlate string, checkedBy int64, checklistItems interface{}) (int64, error) {
	carChecked := &modelCheckAmbu.CarChecked{
		CarID:            carID,
		LicensePlateName: licensePlate,
		CheckedBy:        &checkedBy,
		ChecklistItems:   checklistItems,
		IsActive:         true,
	}

	_, err := db.NewInsert().Model(carChecked).Exec(ctx)
	if err != nil {
		return 0, fmt.Errorf("บันทึกข้อมูลไม่สำเร็จ: %w", err)
	}

	return carChecked.ID, nil
}
