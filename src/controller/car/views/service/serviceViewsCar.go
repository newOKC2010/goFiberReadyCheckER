package serviceViewsCar

import (
	"context"

	modelCheckAmbu "go-fiber-check-ambu/src/database/models/checkAmbu"

	"github.com/uptrace/bun"
)

func GetAllCars(ctx context.Context, db *bun.DB) ([]modelCheckAmbu.Car, error) {
	var cars []modelCheckAmbu.Car
	err := db.NewSelect().
		Model(&cars).
		Where("deleted_at IS NULL").
		Order("id ASC").
		Scan(ctx)

	return cars, err
}
