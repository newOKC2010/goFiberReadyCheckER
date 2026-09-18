package serviceViewsEmergencyList

import (
	"context"

	modelEmergency "go-fiber-check-ambu/src/database/models/emergency"

	"github.com/uptrace/bun"
)

func GetAllEmergencyLists(ctx context.Context, db *bun.DB, offset, limit int) ([]modelEmergency.EmergencyList, int, error) {
	var items []modelEmergency.EmergencyList

	baseQuery := db.NewSelect().
		Model(&items).
		Where("deleted_at IS NULL")

	totalCount, _ := baseQuery.Count(ctx)

	query := baseQuery.Order("id ASC")
	if limit > 0 {
		query = query.Limit(limit).Offset(offset)
	}

	err := query.Scan(ctx)
	return items, totalCount, err
}
