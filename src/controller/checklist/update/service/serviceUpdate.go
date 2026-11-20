package serviceUpdateChecklist

import (
	"context"
	"fmt"

	modelCheckAmbu "go-fiber-check-ambu/src/database/models/checkAmbu"

	"github.com/uptrace/bun"
)

func CheckChecklistExists(ctx context.Context, db *bun.DB, checklistID int64) (bool, error) {
	count, err := db.NewSelect().
		Model((*modelCheckAmbu.Checklist)(nil)).
		Where("id = ?", checklistID).
		Where("deleted_at IS NULL").
		Count(ctx)

	return count > 0, err
}

func GetChecklistRole(ctx context.Context, db *bun.DB, checklistID int64) (string, error) {
	var item modelCheckAmbu.Checklist
	err := db.NewSelect().
		Model(&item).
		Column("role").
		Where("id = ?", checklistID).
		Where("deleted_at IS NULL").
		Scan(ctx)
	return item.Role, err
}

func CheckNameExists(ctx context.Context, db *bun.DB, name, role string, excludeID int64) (bool, error) {
	count, err := db.NewSelect().
		Model((*modelCheckAmbu.Checklist)(nil)).
		Where("name = ?", name).
		Where("role = ?", role).
		Where("id != ?", excludeID).
		Where("deleted_at IS NULL").
		Count(ctx)

	return count > 0, err
}

func UpdateChecklist(ctx context.Context, db *bun.DB, checklistID int64, name string, role *string, isActive *bool) error {
	query := db.NewUpdate().
		Model((*modelCheckAmbu.Checklist)(nil)).
		Where("id = ?", checklistID).
		Where("deleted_at IS NULL").
		Set("name = ?", name)

	if role != nil {
		query = query.Set("role = ?", *role)
	}
	if isActive != nil {
		query = query.Set("is_active = ?", *isActive)
	}

	_, err := query.Exec(ctx)
	if err != nil {
		return fmt.Errorf("แก้ไขข้อมูลไม่สำเร็จ")
	}

	return nil
}
