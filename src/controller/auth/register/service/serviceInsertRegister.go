package serviceRegister

import (
	"context"
	"fmt"

	registerUtils "go-fiber-check-ambu/src/controller/auth/register/utils"
	modelAuth "go-fiber-check-ambu/src/database/models/auth"

	"github.com/uptrace/bun"
)

func CreateUser(ctx context.Context, db *bun.DB, cid, fullName, email string) (*modelAuth.UserER, error) {
	hashCID := registerUtils.HashCID(cid)

	user := &modelAuth.UserER{
		CID:      cid,
		HashCID:  hashCID,
		FullName: fullName,
		Email:    email,
		Role:     modelAuth.RoleUser,
		Status:   true,
	}

	_, err := db.NewInsert().Model(user).Exec(ctx)
	if err != nil {
		return nil, fmt.Errorf("บันทึกข้อมูลไม่สำเร็จ: %w", err)
	}

	return user, nil
}
