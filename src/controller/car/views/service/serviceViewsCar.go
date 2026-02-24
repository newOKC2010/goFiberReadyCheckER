package serviceViewsCar

import (
	"context"

	modelCheckAmbu "go-fiber-check-ambu/src/database/models/checkAmbu"

	"github.com/uptrace/bun"
)

func GetAllCars(ctx context.Context, db *bun.DB, offset, limit int) ([]modelCheckAmbu.Car, int, error) {
	var cars []modelCheckAmbu.Car

	baseQuery := db.NewSelect().
		Model(&cars).
		Where("deleted_at IS NULL")

	totalCount, _ := baseQuery.Count(ctx)

	query := baseQuery.Order("id ASC")
	if limit > 0 {
		query = query.Limit(limit).Offset(offset)
	}

	err := query.Scan(ctx)
	return cars, totalCount, err
}
