package serviceLogin

import (
	"context"

	"github.com/uptrace/bun"

	modelAuth "go-fiber-check-ambu/src/database/models/auth"
)

func GetUserByEmail(db *bun.DB, email string) (*modelAuth.UserER, error) {
	ctx := context.Background()
	user := new(modelAuth.UserER)

	err := db.NewSelect().
		Model(user).
		Where("LOWER(email) = LOWER(?)", email).
		Scan(ctx)

	if err != nil {
		return nil, err
	}

	return user, nil
}
