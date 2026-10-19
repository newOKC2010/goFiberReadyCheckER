package serviceViewsParcelChecked

import (
	"context"

	viewsUtils "go-fiber-check-ambu/src/controller/parcelChecked/views/utils"
	modelParcel "go-fiber-check-ambu/src/database/models/parcel"

	"github.com/uptrace/bun"
)

func GetAllParcelChecked(ctx context.Context, db *bun.DB, filters viewsUtils.FilterParams) ([]viewsUtils.ParcelCheckedData, int, error) {
	var data []viewsUtils.ParcelCheckedData

	base := db.NewSelect().Model((*modelParcel.ParcelChecked)(nil)).
		Where("parcel_checked.is_active = ?", true).
		Where("parcel_checked.deleted_at IS NULL")

	if filters.ID != "" {
		base = base.Where("parcel_checked.id = ?", filters.ID)
	}
	if filters.DateFrom != "" {
		base = base.Where("parcel_checked.checked_date >= ?", filters.DateFrom)
	}
	if filters.DateTo != "" {
		base = base.Where("parcel_checked.checked_date <= ?", filters.DateTo)
	}
	if filters.ParcelID != "" {
		base = base.Where("parcel_checked.parcel_id = ?", filters.ParcelID)
	}
	if filters.StaffID != "" {
		base = base.Where("parcel_checked.checked_by = ?", filters.StaffID)
	}

	totalCount, _ := base.Count(ctx)

	query := base.
		Column("parcel_checked.id", "parcel_checked.parcel_name", "parcel_checked.checked_date", "parcel_checked.checked_by", "parcel_checked.checklist_items").
		ColumnExpr("user_er.full_name AS full_name").
		Join("LEFT JOIN user_er ON user_er.id = parcel_checked.checked_by").
		Order("parcel_checked.checked_date DESC")

	if filters.Limit > 0 {
		query = query.Limit(filters.Limit).Offset(filters.Offset)
	}

	err := query.Scan(ctx, &data)
	return data, totalCount, err
}

func GetParcelCheckedByUserID(ctx context.Context, db *bun.DB, userID int64, filters viewsUtils.FilterParams) ([]viewsUtils.ParcelCheckedData, int, error) {
	var data []viewsUtils.ParcelCheckedData

	base := db.NewSelect().Model((*modelParcel.ParcelChecked)(nil)).
		Where("parcel_checked.checked_by = ?", userID).
		Where("parcel_checked.is_active = ?", true).
		Where("parcel_checked.deleted_at IS NULL")

	if filters.ID != "" {
		base = base.Where("parcel_checked.id = ?", filters.ID)
	}
	if filters.DateFrom != "" {
		base = base.Where("parcel_checked.checked_date >= ?", filters.DateFrom)
	}
	if filters.DateTo != "" {
		base = base.Where("parcel_checked.checked_date <= ?", filters.DateTo)
	}
	if filters.ParcelID != "" {
		base = base.Where("parcel_checked.parcel_id = ?", filters.ParcelID)
	}

	totalCount, _ := base.Count(ctx)
	query := base.Column("id", "parcel_name", "checked_date", "checked_by", "checklist_items").
		Order("parcel_checked.checked_date DESC")
	if filters.Limit > 0 {
		query = query.Limit(filters.Limit).Offset(filters.Offset)
	}

	err := query.Scan(ctx, &data)
	return data, totalCount, err
}
