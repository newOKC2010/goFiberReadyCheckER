package updateParcelChecked

import (
	"context"

	handlerUpdate "go-fiber-check-ambu/src/controller/parcelChecked/update/handler"
	serviceUpdate "go-fiber-check-ambu/src/controller/parcelChecked/update/service"
	updateUtils "go-fiber-check-ambu/src/controller/parcelChecked/update/utils"
	"go-fiber-check-ambu/src/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func UpdateParcelChecked(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user_er").(*middleware.UserERInfo)

		var req updateUtils.UpdateChecklistItemRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(updateUtils.UpdateResponse{Success: false, Message: "ข้อมูลไม่ถูกต้อง"})
		}

		if err := handlerUpdate.ValidateRequest(req.ParcelCheckedID, req.ChecklistID); err != nil {
			return c.Status(400).JSON(updateUtils.UpdateResponse{Success: false, Message: err.Error()})
		}

		ctx := context.Background()

		exists, err := serviceUpdate.CheckParcelCheckedExists(ctx, db, req.ParcelCheckedID)
		if err != nil {
			return c.Status(500).JSON(updateUtils.UpdateResponse{Success: false, Message: "ตรวจสอบข้อมูลไม่สำเร็จ"})
		}
		if !exists {
			return c.Status(404).JSON(updateUtils.UpdateResponse{Success: false, Message: "ไม่พบรายการที่ต้องการแก้ไข"})
		}

		hasPerm, err := serviceUpdate.CheckUpdatePermission(ctx, db, req.ParcelCheckedID, user.ID, user.Role)
		if err != nil {
			return c.Status(500).JSON(updateUtils.UpdateResponse{Success: false, Message: "ตรวจสอบสิทธิ์ไม่สำเร็จ"})
		}
		if !hasPerm {
			return c.Status(403).JSON(updateUtils.UpdateResponse{Success: false, Message: "ไม่มีสิทธิ์แก้ไขข้อมูลนี้"})
		}

		form, _ := c.MultipartForm()
		var images []string
		var hasImagesField bool
		if form != nil {
			images, hasImagesField, err = handlerUpdate.ProcessUpdateImages(c, form, req.ChecklistID, user.ID)
			if err != nil {
				return c.Status(400).JSON(updateUtils.UpdateResponse{Success: false, Message: err.Error()})
			}
		}

		if err := serviceUpdate.UpdateChecklistItem(ctx, db, req.ParcelCheckedID, req.ChecklistID, req.Note, req.Status, images, hasImagesField); err != nil {
			return c.Status(500).JSON(updateUtils.UpdateResponse{Success: false, Message: err.Error()})
		}

		return c.Status(200).JSON(updateUtils.UpdateResponse{Success: true, Message: "แก้ไขข้อมูลสำเร็จ"})
	}
}
