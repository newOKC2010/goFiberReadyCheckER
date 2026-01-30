package serviceViews

import (
	"context"

	"github.com/uptrace/bun"

	viewsUtils "go-fiber-check-ambu/src/controller/carChecked/views/utils"
	modelCheckAmbu "go-fiber-check-ambu/src/database/models/checkAmbu"
)

func GetAllCarChecked(ctx context.Context, db *bun.DB) ([]viewsUtils.CarCheckedData, error) {
	var data []viewsUtils.CarCheckedData

	query := db.NewSelect().
		Model((*modelCheckAmbu.CarChecked)(nil)).
		Column("car_checked.id", "car_checked.license_plate_name", "car_checked.checked_date", "car_checked.checked_by", "car_checked.checklist_items").
		ColumnExpr("user_er.full_name AS full_name").
		Join("LEFT JOIN user_er ON user_er.id = car_checked.checked_by").
		Where("car_checked.is_active = ?", true).
		Where("car_checked.deleted_at IS NULL").
		Order("car_checked.checked_date DESC")

	err := query.Scan(ctx, &data)

	return data, err
}

func GetCarCheckedByUserID(ctx context.Context, db *bun.DB, userID int64) ([]viewsUtils.CarCheckedData, error) {
	var data []viewsUtils.CarCheckedData
	err := db.NewSelect().
		Model((*modelCheckAmbu.CarChecked)(nil)).
		Column("id", "license_plate_name", "checked_date", "checked_by", "checklist_items").
		Where("car_checked.checked_by = ?", userID).
		Where("car_checked.is_active = ?", true).
		Where("car_checked.deleted_at IS NULL").
		Order("car_checked.checked_date DESC").
		Scan(ctx, &data)

	return data, err
}
