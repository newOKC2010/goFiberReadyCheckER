package serviceLogin

import (
	"context"
	"time"

	"github.com/uptrace/bun"

	modelAuth "go-fiber-check-ambu/src/database/models/auth"
)

func VerifyOTP(db *bun.DB, email, otp string) (*modelAuth.UserER, bool) {
	ctx := context.Background()
	user := new(modelAuth.UserER)

	err := db.NewSelect().
		Model(user).
		Where("LOWER(email) = LOWER(?)", email).
		Scan(ctx)

	if err != nil {
		return nil, false
	}

	// ตรวจสอบว่ามี OTP หรือไม่
	if user.OtpCode == nil || user.OtpExpiresAt == nil {
		return nil, false
	}

	// ตรวจสอบว่า OTP หมดอายุหรือไม่
	if time.Now().After(*user.OtpExpiresAt) {
		return nil, false
	}

	// ตรวจสอบว่า OTP ตรงกันหรือไม่
	if *user.OtpCode != otp {
		return nil, false
	}

	return user, true
}
