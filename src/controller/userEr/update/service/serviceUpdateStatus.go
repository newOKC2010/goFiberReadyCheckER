package serviceUpdate

import (
	"context"
	"fmt"

	modelAuth "go-fiber-check-ambu/src/database/models/auth"

	"github.com/uptrace/bun"
)

type UserBasicInfo struct {
	FullName string
	CID      string
	Email    string
}

func GetUserBasicInfo(ctx context.Context, db *bun.DB, userID int64) (*UserBasicInfo, error) {
	var user modelAuth.UserER
	err := db.NewSelect().
		Model(&user).
		Column("full_name", "cid", "email").
		Where("id = ?", userID).
		Scan(ctx)
	if err != nil {
		return nil, fmt.Errorf("ไม่พบผู้ใช้ ID: %d", userID)
	}
	return &UserBasicInfo{FullName: user.FullName, CID: user.CID, Email: user.Email}, nil
}

func UpdateStatus(ctx context.Context, db *bun.DB, userID int64, status bool, role string) error {
	q := db.NewUpdate().
		Model((*modelAuth.UserER)(nil)).
		Set("status = ?", status).
		Where("id = ?", userID)

	if role != "" {
		q = q.Set("role = ?", role)
	}

	_, err := q.Exec(ctx)
	return err
}
