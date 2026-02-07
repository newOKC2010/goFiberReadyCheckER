package serviceAddChecklist

import (
	"context"
	"fmt"

	modelCheckAmbu "go-fiber-check-ambu/src/database/models/checkAmbu"

	"github.com/uptrace/bun"
)

func CheckChecklistExists(ctx context.Context, db *bun.DB, name string) (bool, error) {
	count, err := db.NewSelect().
		Model((*modelCheckAmbu.Checklist)(nil)).
		Where("name = ?", name).
		Where("deleted_at IS NULL").
		Count(ctx)

	return count > 0, err
}

func CreateChecklist(ctx context.Context, db *bun.DB, name string) (int64, error) {
	checklist := &modelCheckAmbu.Checklist{
		Name:     name,
		IsActive: true,
	}

	_, err := db.NewInsert().
		Model(checklist).
		Exec(ctx)

	if err != nil {
		return 0, fmt.Errorf("เพิ่มรายการตรวจสอบไม่สำเร็จ")
	}

	return checklist.ID, nil
}
