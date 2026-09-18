package mainAddEmergencyList

import (
	"context"
	"strings"

	handlerAdd "go-fiber-check-ambu/src/controller/emergencyList/add/handler"
	serviceAdd "go-fiber-check-ambu/src/controller/emergencyList/add/service"
	addUtils "go-fiber-check-ambu/src/controller/emergencyList/add/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func AddEmergencyList(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req addUtils.AddEmergencyListRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(addUtils.AddEmergencyListResponse{Success: false, Message: "ข้อมูลไม่ถูกต้อง"})
		}

		req.Name = strings.TrimSpace(req.Name)

		if err := handlerAdd.ValidateName(req.Name); err != nil {
			return c.Status(400).JSON(addUtils.AddEmergencyListResponse{Success: false, Message: err.Error()})
		}

		ctx := context.Background()

		exists, err := serviceAdd.CheckEmergencyListExists(ctx, db, req.Name)
		if err != nil {
			return c.Status(500).JSON(addUtils.AddEmergencyListResponse{Success: false, Message: "ตรวจสอบข้อมูลไม่สำเร็จ"})
		}
		if exists {
			return c.Status(400).JSON(addUtils.AddEmergencyListResponse{Success: false, Message: "ชื่อรายการตรวจสอบนี้มีในระบบแล้ว"})
		}

		id, err := serviceAdd.CreateEmergencyList(ctx, db, req.Name, req.Description, req.ItemType, req.TrueLabel, req.FalseLabel)
		if err != nil {
			return c.Status(500).JSON(addUtils.AddEmergencyListResponse{Success: false, Message: err.Error()})
		}

		return c.Status(201).JSON(addUtils.AddEmergencyListResponse{
			Success:         true,
			Message:         "เพิ่มรายการตรวจสอบสำเร็จ",
			EmergencyListID: id,
		})
	}
}
