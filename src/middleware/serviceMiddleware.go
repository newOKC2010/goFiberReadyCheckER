package middleware

import (
	"context"
	"time"

	"github.com/uptrace/bun"

	modelAuth "go-fiber-check-ambu/src/database/models/auth"
)

func VerifyToken(db *bun.DB, userID int64, token string) error {
	ctx := context.Background()
	tokenRecord := new(modelAuth.Tokens)

	err := db.NewSelect().
		Model(tokenRecord).
		Where("user_er_id = ?", userID).
		Where("token = ?", token).
		Where("expires_at > ?", time.Now()).
		Scan(ctx)

	return err
}

func GetUserByID(db *bun.DB, userID int64) (*UserERInfo, error) {
	ctx := context.Background()
	user := new(modelAuth.UserER)

	err := db.NewSelect().
		Model(user).
		Where("u.id = ?", userID).
		Scan(ctx)

	if err != nil {
		return nil, err
	}

	userInfo := &UserERInfo{
		ID:     user.ID,
		Email:  user.Email,
		Role:   string(user.Role),
		Status: user.Status,
	}

	return userInfo, nil
}
