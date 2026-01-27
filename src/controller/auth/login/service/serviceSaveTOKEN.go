package serviceLogin

import (
	"context"
	"time"

	"github.com/uptrace/bun"

	loginHandler "go-fiber-check-ambu/src/controller/auth/login/handler"
	modelAuth "go-fiber-check-ambu/src/database/models/auth"
	loadEnv "go-fiber-check-ambu/src/loadEnv"
)

func SaveTokenToDB(db *bun.DB, userERID int64, token string) error {
	ctx := context.Background()
	jwtConfig := loadEnv.LoadJWT()
	expiresInSeconds := loginHandler.GetExpiresInSeconds(jwtConfig.ExpireIn, 3600)
	expiresAt := time.Now().Add(time.Second * time.Duration(expiresInSeconds))

	tokenData := &modelAuth.Tokens{
		UserERID:  userERID,
		Token:     token,
		ExpiresAt: expiresAt,
		LoginLast: time.Now(),
	}

	_, err := db.NewInsert().
		Model(tokenData).
		On("CONFLICT (user_er_id) DO UPDATE").
		Set("token = EXCLUDED.token").
		Set("expires_at = EXCLUDED.expires_at").
		Set("login_last = EXCLUDED.login_last").
		Exec(ctx)

	return err
}
