package serviceViewsChecklist

import (
	"context"

	modelCheckAmbu "go-fiber-check-ambu/src/database/models/checkAmbu"

	"github.com/uptrace/bun"
)

func GetAllChecklists(ctx context.Context, db *bun.DB, offset, limit int, callerRole, filterRole string) ([]modelCheckAmbu.Checklist, int, error) {
	var checklists []modelCheckAmbu.Checklist

	baseQuery := db.NewSelect().
		Model(&checklists).
		Where("deleted_at IS NULL")

	// admin/super_admin filter ด้วย filterRole ได้, user/driver กรองตาม role ตัวเองเสมอ
	if callerRole != "admin" && callerRole != "super_admin" {
		baseQuery = baseQuery.Where("role = ?", callerRole)
	} else if filterRole != "" {
		baseQuery = baseQuery.Where("role = ?", filterRole)
	}

	totalCount, _ := baseQuery.Count(ctx)

	query := baseQuery.Order("id ASC")
	if limit > 0 {
		query = query.Limit(limit).Offset(offset)
	}

	err := query.Scan(ctx)
	return checklists, totalCount, err
}
