package handlerAdd

import (
	"context"
	"log"
	"time"

	mophAlert "go-fiber-check-ambu/src/controller/alert/moph"
	handlerMophAlert "go-fiber-check-ambu/src/controller/alert/moph/handler"
	mophAlertUtils "go-fiber-check-ambu/src/controller/alert/moph/utils"
	serviceAdd "go-fiber-check-ambu/src/controller/carChecked/add/service"
	addUtils "go-fiber-check-ambu/src/controller/carChecked/add/utils"

	"github.com/uptrace/bun"
)

func SendCarCheckedAlert(ctx context.Context, db *bun.DB, userID int64, vehicleName string, checklistItems addUtils.ChecklistItems) {
	go func() {
		username, err := serviceAdd.GetUserFullName(ctx, db, userID)
		if err != nil {
			log.Printf("⚠️ ไม่สามารถดึงชื่อผู้ใช้: %v", err)
			username = "ไม่ระบุ"
		}

		cids, err := serviceAdd.GetActiveCIDs(ctx, db)
		if err != nil || len(cids) == 0 {
			log.Printf("⚠️ ไม่มี users ที่จะส่ง alert: %v", err)
			return
		}

		loc, _ := time.LoadLocation("Asia/Bangkok")
		checkedDate := time.Now().In(loc).Format("2/1/2006 15:04:05")
		flexMsg := handlerMophAlert.CreateCarCheckedFlexMessage(
			vehicleName,
			username,
			checkedDate,
			checklistItems.Items,
		)

		payload := mophAlertUtils.FlexAlertPayload{
			CID:      cids,
			Messages: []mophAlertUtils.FlexMessage{flexMsg},
		}

		result := mophAlert.SendAlert(payload)
		if result.MessageCode != 200 {
			log.Printf("⚠️ ส่ง alert ไม่สำเร็จ: %s", result.Message)
		} else {
			log.Printf("✅ ส่ง alert สำเร็จไปยัง %d users", len(cids))
		}
	}()
}
