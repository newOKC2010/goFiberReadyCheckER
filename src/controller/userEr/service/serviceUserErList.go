package serviceList

import (
	"context"

	"github.com/uptrace/bun"

	listUtils "go-fiber-check-ambu/src/controller/userEr/utils"
	modelAuth "go-fiber-check-ambu/src/database/models/auth"
)

func GetAllStaff(ctx context.Context, db *bun.DB, callerRole string) ([]listUtils.StaffItem, error) {
	var staff []listUtils.StaffItem

	// admin → เห็นเฉพาะ anonymous, user, driver
	// super_admin → เห็น anonymous, user, driver, admin
	var allowedRoles []string
	if callerRole == "super_admin" {
		allowedRoles = []string{"anonymous", "user", "driver", "admin"}
	} else {
		allowedRoles = []string{"anonymous", "user", "driver"}
	}

	err := db.NewSelect().
		Model((*modelAuth.UserER)(nil)).
		Column("id", "full_name", "email", "role", "status").
		Where("role IN (?)", bun.In(allowedRoles)).
		Order("full_name ASC").
		Scan(ctx, &staff)

	return staff, err
}
