package serviceAdd

import (
	"context"
	"fmt"

	modelAuth "go-fiber-check-ambu/src/database/models/auth"

	"github.com/uptrace/bun"
)

func GetActiveCIDs(ctx context.Context, db *bun.DB) ([]string, error) {
	var users []modelAuth.UserER
	err := db.NewSelect().
		Model(&users).
		Column("cid").
		Where("status = ?", true).
		Scan(ctx)

	if err != nil {
		return nil, err
	}

	cids := make([]string, len(users))
	for i, user := range users {
		cids[i] = user.CID
	}

	return cids, nil
}

func GetUserFullName(ctx context.Context, db *bun.DB, userID int64) (string, error) {
	var user modelAuth.UserER
	err := db.NewSelect().
		Model(&user).
		Column("full_name").
		Where("id = ?", userID).
		Scan(ctx)

	if err != nil {
		return "", fmt.Errorf("ไม่พบข้อมูลผู้ใช้")
	}

	return user.FullName, nil
}
