package updateMain

import (
	"context"

	handlerUpdate "go-fiber-check-ambu/src/controller/carChecked/update/handler"
	serviceUpdate "go-fiber-check-ambu/src/controller/carChecked/update/service"
	updateUtils "go-fiber-check-ambu/src/controller/carChecked/update/utils"
	middleware "go-fiber-check-ambu/src/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func UpdateCarChecked(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user_er").(*middleware.UserERInfo)

		var req updateUtils.UpdateChecklistItemRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(updateUtils.UpdateResponse{
				Success: false,
				Message: "ข้อมูลไม่ถูกต้อง",
			})
		}

		if err := handlerUpdate.ValidateRequest(req.CarCheckedID, req.ChecklistID); err != nil {
			return c.Status(400).JSON(updateUtils.UpdateResponse{
				Success: false,
				Message: err.Error(),
			})
		}

		ctx := context.Background()

		exists, err := serviceUpdate.CheckCarCheckedExists(ctx, db, req.CarCheckedID)
		if err != nil {
			return c.Status(500).JSON(updateUtils.UpdateResponse{
				Success: false,
				Message: "ตรวจสอบข้อมูลไม่สำเร็จ",
			})
		}
		if !exists {
			return c.Status(404).JSON(updateUtils.UpdateResponse{
				Success: false,
				Message: "ไม่พบรายการที่ต้องการแก้ไข",
			})
		}

		hasPermission, err := serviceUpdate.CheckUpdatePermission(ctx, db, req.CarCheckedID, user.ID, user.Role)
		if err != nil {
			return c.Status(500).JSON(updateUtils.UpdateResponse{
				Success: false,
				Message: "ตรวจสอบสิทธิ์ไม่สำเร็จ",
			})
		}
		if !hasPermission {
			return c.Status(403).JSON(updateUtils.UpdateResponse{
				Success: false,
				Message: "ไม่มีสิทธิ์แก้ไขข้อมูลนี้",
			})
		}

		form, _ := c.MultipartForm()
		var images []string
		var hasImagesField bool
		if form != nil {
			images, hasImagesField, err = handlerUpdate.ProcessUpdateImages(c, form, req.ChecklistID, user.ID)
			if err != nil {
				return c.Status(400).JSON(updateUtils.UpdateResponse{
					Success: false,
					Message: err.Error(),
				})
			}
		}

		// ถ้าไม่ส่ง images field มา → ลบรูปทั้งหมด
		// ถ้าส่ง images field มา → แทนที่รูปทั้งหมด
		err = serviceUpdate.UpdateChecklistItem(ctx, db, req.CarCheckedID, req.ChecklistID, req.Note, req.Status, images, hasImagesField)
		if err != nil {
			return c.Status(500).JSON(updateUtils.UpdateResponse{
				Success: false,
				Message: err.Error(),
			})
		}

		return c.Status(200).JSON(updateUtils.UpdateResponse{
			Success: true,
			Message: "แก้ไขข้อมูลสำเร็จ",
		})
	}
}
