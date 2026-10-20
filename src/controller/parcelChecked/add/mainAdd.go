package mainAddParcelChecked

import (
	"context"
	"log"
	"strconv"
	"strings"

	handlerAdd "go-fiber-check-ambu/src/controller/parcelChecked/add/handler"
	serviceAdd "go-fiber-check-ambu/src/controller/parcelChecked/add/service"
	addUtils "go-fiber-check-ambu/src/controller/parcelChecked/add/utils"
	"go-fiber-check-ambu/src/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func AddParcelChecked(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user_er").(*middleware.UserERInfo)

		form, err := c.MultipartForm()
		if err != nil {
			return c.Status(400).JSON(addUtils.AddParcelCheckedResponse{Success: false, Message: "ไม่สามารถอ่านข้อมูล form ได้"})
		}

		var parcelIDStr, checklistItemsJSON string
		for k, v := range form.Value {
			if len(v) == 0 {
				continue
			}
			switch strings.TrimSpace(k) {
			case "parcel_id":
				parcelIDStr = v[0]
			case "checklist_items":
				checklistItemsJSON = v[0]
			}
		}
		parcelID, _ := strconv.ParseInt(parcelIDStr, 10, 64)

		if err := handlerAdd.ValidateParcelID(parcelID); err != nil {
			return c.Status(400).JSON(addUtils.AddParcelCheckedResponse{Success: false, Message: err.Error()})
		}

		ctx := context.Background()

		p, err := serviceAdd.GetParcelByID(ctx, db, parcelID)
		if err != nil {
			return c.Status(404).JSON(addUtils.AddParcelCheckedResponse{Success: false, Message: err.Error()})
		}

		checklistItems, err := handlerAdd.ParseChecklistItems(checklistItemsJSON)
		if err != nil {
			return c.Status(400).JSON(addUtils.AddParcelCheckedResponse{Success: false, Message: "รูปแบบ checklist_items ไม่ถูกต้อง"})
		}

		if err := handlerAdd.ValidateChecklistItems(checklistItems); err != nil {
			return c.Status(400).JSON(addUtils.AddParcelCheckedResponse{Success: false, Message: err.Error()})
		}

		if err := handlerAdd.ProcessFilesAndUpdateImages(c, form, checklistItems, user.ID); err != nil {
			return c.Status(500).JSON(addUtils.AddParcelCheckedResponse{Success: false, Message: "จัดการไฟล์ไม่สำเร็จ: " + err.Error()})
		}

		parcelCheckedID, err := serviceAdd.CreateParcelChecked(ctx, db, p.ID, p.Name, user.ID, checklistItems)
		if err != nil {
			return c.Status(500).JSON(addUtils.AddParcelCheckedResponse{Success: false, Message: err.Error()})
		}

		log.Printf("✅ เพิ่มข้อมูลการตรวจสอบพัสดุสำเร็จ: ID=%d, Parcel=%s", parcelCheckedID, p.Name)
		handlerAdd.SendParcelCheckedAlert(ctx, db, user.ID, p.Name, *checklistItems)

		return c.Status(201).JSON(addUtils.AddParcelCheckedResponse{Success: true, Message: "บันทึกข้อมูลสำเร็จ", ID: parcelCheckedID})
	}
}
