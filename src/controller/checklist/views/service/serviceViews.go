package serviceViewsChecklist

import (
	"context"

	modelCheckAmbu "go-fiber-check-ambu/src/database/models/checkAmbu"

	"github.com/uptrace/bun"
)

func GetAllChecklists(ctx context.Context, db *bun.DB, offset, limit int) ([]modelCheckAmbu.Checklist, int, error) {
	var checklists []modelCheckAmbu.Checklist

	baseQuery := db.NewSelect().
		Model(&checklists).
		Where("deleted_at IS NULL")

	totalCount, _ := baseQuery.Count(ctx)

	query := baseQuery.Order("id ASC")
	if limit > 0 {
		query = query.Limit(limit).Offset(offset)
	}

	err := query.Scan(ctx)
	return checklists, totalCount, err
}
