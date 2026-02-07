package serviceViewsChecklist

import (
	"context"

	modelCheckAmbu "go-fiber-check-ambu/src/database/models/checkAmbu"

	"github.com/uptrace/bun"
)

func GetAllChecklists(ctx context.Context, db *bun.DB) ([]modelCheckAmbu.Checklist, error) {
	var checklists []modelCheckAmbu.Checklist
	err := db.NewSelect().
		Model(&checklists).
		Where("deleted_at IS NULL").
		Order("id ASC").
		Scan(ctx)

	return checklists, err
}
