package serviceList

import (
	"context"

	"github.com/uptrace/bun"

	listUtils "go-fiber-check-ambu/src/controller/userEr/utils"
	modelAuth "go-fiber-check-ambu/src/database/models/auth"
)

func GetAllStaff(ctx context.Context, db *bun.DB) ([]listUtils.StaffItem, error) {
	var staff []listUtils.StaffItem

	err := db.NewSelect().
		Model((*modelAuth.UserER)(nil)).
		Column("id", "full_name").
		Where("status = ?", true).
		Order("full_name ASC").
		Scan(ctx, &staff)

	return staff, err
}
