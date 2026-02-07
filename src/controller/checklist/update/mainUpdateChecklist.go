package mainUpdateChecklist

import (
	"context"

	handlerUpdateChecklist "go-fiber-check-ambu/src/controller/checklist/update/handler"
	serviceUpdateChecklist "go-fiber-check-ambu/src/controller/checklist/update/service"
	updateChecklistUtils "go-fiber-check-ambu/src/controller/checklist/update/utils"
	"go-fiber-check-ambu/src/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func UpdateChecklist(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user_er").(*middleware.UserERInfo)

		if err := handlerUpdateChecklist.ValidateAdminRole(user.Role); err != nil {
			return c.Status(403).JSON(updateChecklistUtils.UpdateChecklistResponse{
				Success: false,
				Message: err.Error(),
			})
		}

		var req updateChecklistUtils.UpdateChecklistRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(updateChecklistUtils.UpdateChecklistResponse{
				Success: false,
				Message: "ข้อมูลไม่ถูกต้อง",
			})
		}

		if err := handlerUpdateChecklist.ValidateChecklistID(req.ChecklistID); err != nil {
			return c.Status(400).JSON(updateChecklistUtils.UpdateChecklistResponse{
				Success: false,
				Message: err.Error(),
			})
		}

		if err := handlerUpdateChecklist.ValidateName(req.Name); err != nil {
			return c.Status(400).JSON(updateChecklistUtils.UpdateChecklistResponse{
				Success: false,
				Message: err.Error(),
			})
		}

		ctx := context.Background()

		exists, err := serviceUpdateChecklist.CheckChecklistExists(ctx, db, req.ChecklistID)
		if err != nil {
			return c.Status(500).JSON(updateChecklistUtils.UpdateChecklistResponse{
				Success: false,
				Message: "ตรวจสอบข้อมูลไม่สำเร็จ",
			})
		}
		if !exists {
			return c.Status(404).JSON(updateChecklistUtils.UpdateChecklistResponse{
				Success: false,
				Message: "ไม่พบรายการตรวจสอบที่ต้องการแก้ไข",
			})
		}

		duplicate, err := serviceUpdateChecklist.CheckNameExists(ctx, db, req.Name, req.ChecklistID)
		if err != nil {
			return c.Status(500).JSON(updateChecklistUtils.UpdateChecklistResponse{
				Success: false,
				Message: "ตรวจสอบข้อมูลไม่สำเร็จ",
			})
		}
		if duplicate {
			return c.Status(400).JSON(updateChecklistUtils.UpdateChecklistResponse{
				Success: false,
				Message: "ชื่อรายการตรวจสอบนี้มีในระบบแล้ว",
			})
		}

		if err := serviceUpdateChecklist.UpdateChecklist(ctx, db, req.ChecklistID, req.Name, req.IsActive); err != nil {
			return c.Status(500).JSON(updateChecklistUtils.UpdateChecklistResponse{
				Success: false,
				Message: err.Error(),
			})
		}

		return c.Status(200).JSON(updateChecklistUtils.UpdateChecklistResponse{
			Success: true,
			Message: "แก้ไขข้อมูลสำเร็จ",
		})
	}
}
