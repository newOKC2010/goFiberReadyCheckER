package mainAddChecklist

import (
	"context"

	handlerAddChecklist "go-fiber-check-ambu/src/controller/checklist/add/handler"
	serviceAddChecklist "go-fiber-check-ambu/src/controller/checklist/add/service"
	addChecklistUtils "go-fiber-check-ambu/src/controller/checklist/add/utils"
	"go-fiber-check-ambu/src/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func AddChecklist(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user_er").(*middleware.UserERInfo)

		if err := handlerAddChecklist.ValidateAdminRole(user.Role); err != nil {
			return c.Status(403).JSON(addChecklistUtils.AddChecklistResponse{
				Success: false,
				Message: err.Error(),
			})
		}

		var req addChecklistUtils.AddChecklistRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(addChecklistUtils.AddChecklistResponse{
				Success: false,
				Message: "ข้อมูลไม่ถูกต้อง",
			})
		}

		if err := handlerAddChecklist.ValidateName(req.Name); err != nil {
			return c.Status(400).JSON(addChecklistUtils.AddChecklistResponse{
				Success: false,
				Message: err.Error(),
			})
		}

		ctx := context.Background()

		exists, err := serviceAddChecklist.CheckChecklistExists(ctx, db, req.Name)
		if err != nil {
			return c.Status(500).JSON(addChecklistUtils.AddChecklistResponse{
				Success: false,
				Message: "ตรวจสอบข้อมูลไม่สำเร็จ",
			})
		}
		if exists {
			return c.Status(400).JSON(addChecklistUtils.AddChecklistResponse{
				Success: false,
				Message: "ชื่อรายการตรวจสอบนี้มีในระบบแล้ว",
			})
		}

		checklistID, err := serviceAddChecklist.CreateChecklist(ctx, db, req.Name, req.Description)
		if err != nil {
			return c.Status(500).JSON(addChecklistUtils.AddChecklistResponse{
				Success: false,
				Message: err.Error(),
			})
		}

		return c.Status(201).JSON(addChecklistUtils.AddChecklistResponse{
			Success:     true,
			Message:     "เพิ่มรายการตรวจสอบสำเร็จ",
			ChecklistID: checklistID,
		})
	}
}
