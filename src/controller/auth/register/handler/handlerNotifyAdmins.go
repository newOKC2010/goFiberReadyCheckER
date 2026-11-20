package handlerRegister

import (
	"context"
	"log"

	emailAlert "go-fiber-check-ambu/src/controller/alert/email"
	handlerEmailAlert "go-fiber-check-ambu/src/controller/alert/email/handler"
	mophAlert "go-fiber-check-ambu/src/controller/alert/moph"
	handlerMophAlert "go-fiber-check-ambu/src/controller/alert/moph/handler"
	mophAlertUtils "go-fiber-check-ambu/src/controller/alert/moph/utils"
	modelAuth "go-fiber-check-ambu/src/database/models/auth"

	"github.com/uptrace/bun"
)

type adminInfo struct {
	CID   string
	Email string
}

func getAdmins(ctx context.Context, db *bun.DB) ([]adminInfo, error) {
	var users []modelAuth.UserER
	err := db.NewSelect().
		Model(&users).
		Column("cid", "email").
		Where("role IN (?)", bun.In([]string{"admin", "super_admin"})).
		Where("status = ?", true).
		Scan(ctx)
	if err != nil {
		return nil, err
	}

	result := make([]adminInfo, len(users))
	for i, u := range users {
		result[i] = adminInfo{CID: u.CID, Email: u.Email}
	}
	return result, nil
}

// NotifyAdminsNewRegister — แจ้ง admin/super_admin เมื่อมีผู้สมัครใหม่ (async)
func NotifyAdminsNewRegister(db *bun.DB, fullName string) {
	go func() {
		ctx := context.Background()
		admins, err := getAdmins(ctx, db)
		if err != nil || len(admins) == 0 {
			log.Printf("⚠️ ไม่พบ admin สำหรับส่งแจ้งเตือน: %v", err)
			return
		}

		// MOPH alert
		cids := make([]string, len(admins))
		for i, a := range admins {
			cids[i] = a.CID
		}
		flexMsg := handlerMophAlert.CreateNewRegisterFlexMessage(fullName)
		result := mophAlert.SendAlert(mophAlertUtils.FlexAlertPayload{
			CID:      cids,
			Messages: []mophAlertUtils.FlexMessage{flexMsg},
		})
		if result.MessageCode != 200 {
			log.Printf("⚠️ ส่ง MOPH register alert ไม่สำเร็จ: %s", result.Message)
		} else {
			log.Printf("✅ ส่ง MOPH register alert ไปยัง %d admin", len(cids))
		}

		// Email
		subject := "🔔 มีผู้สมัครเข้าใช้งานระบบใหม่"
		body := handlerEmailAlert.CreateNewRegisterEmailHTML(fullName)
		for _, a := range admins {
			if a.Email == "" {
				continue
			}
			if err := emailAlert.SendEmailSMTP(a.Email, subject, body); err != nil {
				log.Printf("⚠️ ส่ง email ไม่สำเร็จ (%s): %v", a.Email, err)
			}
		}
	}()
}
