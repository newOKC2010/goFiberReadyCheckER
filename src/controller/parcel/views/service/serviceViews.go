package serviceViewsParcel

import (
	"context"

	modelParcel "go-fiber-check-ambu/src/database/models/parcel"

	"github.com/uptrace/bun"
)

func GetAllParcels(ctx context.Context, db *bun.DB, offset, limit int) ([]modelParcel.Parcel, int, error) {
	var items []modelParcel.Parcel
	baseQuery := db.NewSelect().Model(&items).Where("deleted_at IS NULL")
	totalCount, _ := baseQuery.Count(ctx)
	query := baseQuery.Order("id ASC")
	if limit > 0 {
		query = query.Limit(limit).Offset(offset)
	}
	err := query.Scan(ctx)
	return items, totalCount, err
}
