package serviceList

import (
	"context"

	"github.com/uptrace/bun"

	listUtils "go-fiber-check-ambu/src/controller/userEr/utils"
	modelAuth "go-fiber-check-ambu/src/database/models/auth"
)

type StaffFilter struct {
	Search string
	Role   string
	Status string // "true" | "false" | ""
}

func GetAllStaff(ctx context.Context, db *bun.DB, callerRole string, offset, limit int, f StaffFilter) ([]listUtils.StaffItem, int, error) {
	var staff []listUtils.StaffItem

	// admin → เห็นเฉพาะ anonymous, user, driver
	// super_admin → เห็น anonymous, user, driver, admin
	var allowedRoles []string
	if callerRole == "super_admin" {
		allowedRoles = []string{"anonymous", "user", "driver", "admin"}
	} else {
		allowedRoles = []string{"anonymous", "user", "driver"}
	}

	baseQuery := db.NewSelect().
		Model((*modelAuth.UserER)(nil)).
		Where("role IN (?)", bun.In(allowedRoles))

	if f.Search != "" {
		baseQuery = baseQuery.Where("full_name ILIKE ?", "%"+f.Search+"%")
	}
	if f.Role != "" {
		baseQuery = baseQuery.Where("role = ?", f.Role)
	}
	switch f.Status {
	case "true":
		baseQuery = baseQuery.Where("status = ?", true)
	case "false":
		baseQuery = baseQuery.Where("status = ?", false)
	}

	totalCount, _ := baseQuery.Count(ctx)

	query := baseQuery.
		Column("id", "full_name", "email", "role", "status").
		Order("full_name ASC")
	if limit > 0 {
		query = query.Limit(limit).Offset(offset)
	}

	err := query.Scan(ctx, &staff)
	return staff, totalCount, err
}
