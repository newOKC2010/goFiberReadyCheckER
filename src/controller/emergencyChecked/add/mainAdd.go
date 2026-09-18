package mainAddEmergencyChecked

import (
	"context"
	"log"
	"strconv"
	"strings"

	handlerAdd "go-fiber-check-ambu/src/controller/emergencyChecked/add/handler"
	serviceAdd "go-fiber-check-ambu/src/controller/emergencyChecked/add/service"
	addUtils "go-fiber-check-ambu/src/controller/emergencyChecked/add/utils"
	"go-fiber-check-ambu/src/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func AddEmergencyChecked(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user_er").(*middleware.UserERInfo)

		// อ่าน multipart form ครั้งเดียว แล้วดึง field จาก form.Value โดยตรง
		form, err := c.MultipartForm()
		if err != nil {
			return c.Status(400).JSON(addUtils.AddEmergencyCheckedResponse{Success: false, Message: "ไม่สามารถอ่านข้อมูล form ได้"})
		}

		// trim whitespace จาก key เผื่อ Postman ส่ง tab/space มาด้วย
		var emergencyIDStr, checklistItemsJSON string
		for k, v := range form.Value {
			if len(v) == 0 {
				continue
			}
			switch strings.TrimSpace(k) {
			case "emergency_id":
				emergencyIDStr = v[0]
			case "checklist_items":
				checklistItemsJSON = v[0]
			}
		}
		emergencyID, _ := strconv.ParseInt(emergencyIDStr, 10, 64)

		if err := handlerAdd.ValidateEmergencyID(emergencyID); err != nil {
			return c.Status(400).JSON(addUtils.AddEmergencyCheckedResponse{Success: false, Message: err.Error()})
		}

		ctx := context.Background()

		if err := handlerAdd.ValidateEmergencyNotCheckedToday(ctx, db, emergencyID); err != nil {
			return c.Status(400).JSON(addUtils.AddEmergencyCheckedResponse{Success: false, Message: err.Error()})
		}

		em, err := serviceAdd.GetEmergencyByID(ctx, db, emergencyID)
		if err != nil {
			return c.Status(404).JSON(addUtils.AddEmergencyCheckedResponse{Success: false, Message: err.Error()})
		}

		checklistItems, err := handlerAdd.ParseChecklistItems(checklistItemsJSON)
		if err != nil {
			return c.Status(400).JSON(addUtils.AddEmergencyCheckedResponse{Success: false, Message: "รูปแบบ checklist_items ไม่ถูกต้อง"})
		}

		if err := handlerAdd.ValidateChecklistItems(checklistItems); err != nil {
			return c.Status(400).JSON(addUtils.AddEmergencyCheckedResponse{Success: false, Message: err.Error()})
		}

		if err := handlerAdd.ProcessFilesAndUpdateImages(c, form, checklistItems, user.ID); err != nil {
			return c.Status(500).JSON(addUtils.AddEmergencyCheckedResponse{Success: false, Message: "จัดการไฟล์ไม่สำเร็จ: " + err.Error()})
		}

		emergencyCheckedID, err := serviceAdd.CreateEmergencyChecked(ctx, db, em.ID, em.LicensePlateName, user.ID, checklistItems)
		if err != nil {
			return c.Status(500).JSON(addUtils.AddEmergencyCheckedResponse{Success: false, Message: err.Error()})
		}

		log.Printf("✅ เพิ่มข้อมูลการตรวจสอบรถฉุกเฉินสำเร็จ: ID=%d, Car=%s", emergencyCheckedID, em.LicensePlateName)

		handlerAdd.SendEmergencyCheckedAlert(ctx, db, user.ID, em.LicensePlateName, *checklistItems)

		return c.Status(201).JSON(addUtils.AddEmergencyCheckedResponse{
			Success: true,
			Message: "บันทึกข้อมูลสำเร็จ",
			ID:      emergencyCheckedID,
		})
	}
}
