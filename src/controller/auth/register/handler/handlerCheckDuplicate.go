package handlerRegister

import (
	"context"
	"fmt"

	modelAuth "go-fiber-check-ambu/src/database/models/auth"
	"github.com/uptrace/bun"
)

func CheckCIDExists(ctx context.Context, db *bun.DB, cid string) (bool, error) {
	exists, err := db.NewSelect().
		Model((*modelAuth.UserER)(nil)).
		Where("cid = ?", cid).
		Exists(ctx)
	if err != nil {
		return false, fmt.Errorf("ตรวจสอบเลขบัตรประชาชนไม่สำเร็จ: %w", err)
	}
	return exists, nil
}

func CheckEmailExists(ctx context.Context, db *bun.DB, email string) (bool, error) {
	exists, err := db.NewSelect().
		Model((*modelAuth.UserER)(nil)).
		Where("email = ?", email).
		Exists(ctx)
	if err != nil {
		return false, fmt.Errorf("ตรวจสอบอีเมลไม่สำเร็จ: %w", err)
	}
	return exists, nil
}
