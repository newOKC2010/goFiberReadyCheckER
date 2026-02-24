package serviceViews

import (
	"context"

	"github.com/uptrace/bun"

	viewsUtils "go-fiber-check-ambu/src/controller/carChecked/views/utils"
	modelCheckAmbu "go-fiber-check-ambu/src/database/models/checkAmbu"
)

func GetAllCarChecked(ctx context.Context, db *bun.DB, filters viewsUtils.FilterParams) ([]viewsUtils.CarCheckedData, int, error) {
	var data []viewsUtils.CarCheckedData

	baseQuery := db.NewSelect().
		Model((*modelCheckAmbu.CarChecked)(nil)).
		Where("car_checked.is_active = ?", true).
		Where("car_checked.deleted_at IS NULL")

	if filters.ID != "" {
		baseQuery = baseQuery.Where("car_checked.id = ?", filters.ID)
	}
	if filters.DateFrom != "" {
		baseQuery = baseQuery.Where("car_checked.checked_date >= ?", filters.DateFrom)
	}
	if filters.DateTo != "" {
		baseQuery = baseQuery.Where("car_checked.checked_date <= ?", filters.DateTo)
	}
	if filters.CarID != "" {
		baseQuery = baseQuery.Where("car_checked.car_id = ?", filters.CarID)
	}
	if filters.StaffID != "" {
		baseQuery = baseQuery.Where("car_checked.checked_by = ?", filters.StaffID)
	}

	totalCount, _ := baseQuery.Count(ctx)

	query := baseQuery.
		Column("car_checked.id", "car_checked.license_plate_name", "car_checked.checked_date", "car_checked.checked_by", "car_checked.checklist_items").
		ColumnExpr("user_er.full_name AS full_name").
		Join("LEFT JOIN user_er ON user_er.id = car_checked.checked_by").
		Order("car_checked.checked_date DESC")

	if filters.Limit > 0 {
		query = query.Limit(filters.Limit).Offset(filters.Offset)
	}

	err := query.Scan(ctx, &data)
	return data, totalCount, err
}

func GetCarCheckedByUserID(ctx context.Context, db *bun.DB, userID int64, filters viewsUtils.FilterParams) ([]viewsUtils.CarCheckedData, int, error) {
	var data []viewsUtils.CarCheckedData

	baseQuery := db.NewSelect().
		Model((*modelCheckAmbu.CarChecked)(nil)).
		Where("car_checked.checked_by = ?", userID).
		Where("car_checked.is_active = ?", true).
		Where("car_checked.deleted_at IS NULL")

	if filters.ID != "" {
		baseQuery = baseQuery.Where("car_checked.id = ?", filters.ID)
	}
	if filters.DateFrom != "" {
		baseQuery = baseQuery.Where("car_checked.checked_date >= ?", filters.DateFrom)
	}
	if filters.DateTo != "" {
		baseQuery = baseQuery.Where("car_checked.checked_date <= ?", filters.DateTo)
	}
	if filters.CarID != "" {
		baseQuery = baseQuery.Where("car_checked.car_id = ?", filters.CarID)
	}

	totalCount, _ := baseQuery.Count(ctx)

	query := baseQuery.
		Column("id", "license_plate_name", "checked_date", "checked_by", "checklist_items").
		Order("car_checked.checked_date DESC")

	if filters.Limit > 0 {
		query = query.Limit(filters.Limit).Offset(filters.Offset)
	}

	err := query.Scan(ctx, &data)
	return data, totalCount, err
}
