package serviceViewsEmergencyChecked

import (
	"context"

	"github.com/uptrace/bun"

	viewsUtils "go-fiber-check-ambu/src/controller/emergencyChecked/views/utils"
	modelEmergency "go-fiber-check-ambu/src/database/models/emergency"
)

func GetAllEmergencyChecked(ctx context.Context, db *bun.DB, filters viewsUtils.FilterParams) ([]viewsUtils.EmergencyCheckedData, int, error) {
	var data []viewsUtils.EmergencyCheckedData

	base := db.NewSelect().
		Model((*modelEmergency.EmergencyChecked)(nil)).
		Where("emergency_checked.is_active = ?", true).
		Where("emergency_checked.deleted_at IS NULL")

	if filters.ID != "" {
		base = base.Where("emergency_checked.id = ?", filters.ID)
	}
	if filters.DateFrom != "" {
		base = base.Where("emergency_checked.checked_date >= ?", filters.DateFrom)
	}
	if filters.DateTo != "" {
		base = base.Where("emergency_checked.checked_date <= ?", filters.DateTo)
	}
	if filters.EmergencyID != "" {
		base = base.Where("emergency_checked.emergency_id = ?", filters.EmergencyID)
	}
	if filters.StaffID != "" {
		base = base.Where("emergency_checked.checked_by = ?", filters.StaffID)
	}

	totalCount, _ := base.Count(ctx)

	query := base.
		Column("emergency_checked.id", "emergency_checked.license_plate_name", "emergency_checked.checked_date", "emergency_checked.checked_by", "emergency_checked.checklist_items").
		ColumnExpr("user_er.full_name AS full_name").
		Join("LEFT JOIN user_er ON user_er.id = emergency_checked.checked_by").
		Order("emergency_checked.checked_date DESC")

	if filters.Limit > 0 {
		query = query.Limit(filters.Limit).Offset(filters.Offset)
	}

	err := query.Scan(ctx, &data)
	return data, totalCount, err
}

func GetEmergencyCheckedByUserID(ctx context.Context, db *bun.DB, userID int64, filters viewsUtils.FilterParams) ([]viewsUtils.EmergencyCheckedData, int, error) {
	var data []viewsUtils.EmergencyCheckedData

	base := db.NewSelect().
		Model((*modelEmergency.EmergencyChecked)(nil)).
		Where("emergency_checked.checked_by = ?", userID).
		Where("emergency_checked.is_active = ?", true).
		Where("emergency_checked.deleted_at IS NULL")

	if filters.ID != "" {
		base = base.Where("emergency_checked.id = ?", filters.ID)
	}
	if filters.DateFrom != "" {
		base = base.Where("emergency_checked.checked_date >= ?", filters.DateFrom)
	}
	if filters.DateTo != "" {
		base = base.Where("emergency_checked.checked_date <= ?", filters.DateTo)
	}
	if filters.EmergencyID != "" {
		base = base.Where("emergency_checked.emergency_id = ?", filters.EmergencyID)
	}

	totalCount, _ := base.Count(ctx)

	query := base.
		Column("id", "license_plate_name", "checked_date", "checked_by", "checklist_items").
		Order("emergency_checked.checked_date DESC")

	if filters.Limit > 0 {
		query = query.Limit(filters.Limit).Offset(filters.Offset)
	}

	err := query.Scan(ctx, &data)
	return data, totalCount, err
}
