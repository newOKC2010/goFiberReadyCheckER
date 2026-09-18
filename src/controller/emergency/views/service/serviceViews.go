package serviceViewsEmergency

import (
	"context"
	"strings"

	modelEmergency "go-fiber-check-ambu/src/database/models/emergency"

	"github.com/uptrace/bun"
)

func GetAllEmergencies(ctx context.Context, db *bun.DB, emergencyType string, offset, limit int) ([]modelEmergency.Emergency, int, error) {
	var items []modelEmergency.Emergency

	baseQuery := db.NewSelect().
		Model(&items).
		Where("deleted_at IS NULL")

	if t := strings.ToUpper(strings.TrimSpace(emergencyType)); t != "" {
		baseQuery = baseQuery.Where("type = ?", t)
	}

	totalCount, _ := baseQuery.Count(ctx)

	query := baseQuery.Order("id ASC")
	if limit > 0 {
		query = query.Limit(limit).Offset(offset)
	}

	err := query.Scan(ctx)
	return items, totalCount, err
}
