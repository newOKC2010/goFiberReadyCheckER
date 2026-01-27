package serviceLogin

import (
	"context"
	"time"

	"github.com/uptrace/bun"

	loginHandler "go-fiber-check-ambu/src/controller/auth/login/handler"
	modelAuth "go-fiber-check-ambu/src/database/models/auth"
	loadEnv "go-fiber-check-ambu/src/loadEnv"
)

// UpdateOTPInDB - อัพเดท OTP ลงฐานข้อมูล
func UpdateOTPInDB(db *bun.DB, cid, otpCode string) error {
	ctx := context.Background()
	expiresIn := loadEnv.LoadOTPExpiresIn()
	seconds := loginHandler.GetExpiresInSeconds(expiresIn, 300) // default 5 min
	expiresAt := time.Now().Add(time.Duration(seconds) * time.Second)

	_, err := db.NewUpdate().
		Model((*modelAuth.UserER)(nil)).
		Set("otp_code = ?", otpCode).
		Set("otp_expires_at = ?", expiresAt).
		Set("updated_at = ?", time.Now()).
		Where("cid = ?", cid).
		Where("status = ?", true).
		Exec(ctx)

	return err
}
