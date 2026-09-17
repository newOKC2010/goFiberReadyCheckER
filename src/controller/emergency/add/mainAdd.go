package mainAddEmergency

import (
	"context"
	"strings"

	handlerAdd "go-fiber-check-ambu/src/controller/emergency/add/handler"
	serviceAdd "go-fiber-check-ambu/src/controller/emergency/add/service"
	addUtils "go-fiber-check-ambu/src/controller/emergency/add/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func AddEmergency(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req addUtils.AddEmergencyRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(addUtils.AddEmergencyResponse{
				Success: false,
				Message: "ข้อมูลไม่ถูกต้อง",
			})
		}

		req.LicensePlateName = strings.TrimSpace(req.LicensePlateName)
		req.Type = strings.ToUpper(strings.TrimSpace(req.Type))

		if err := handlerAdd.ValidateLicensePlateName(req.LicensePlateName); err != nil {
			return c.Status(400).JSON(addUtils.AddEmergencyResponse{Success: false, Message: err.Error()})
		}
		if req.Type != "" {
			if err := handlerAdd.ValidateType(req.Type); err != nil {
				return c.Status(400).JSON(addUtils.AddEmergencyResponse{Success: false, Message: err.Error()})
			}
		}

		ctx := context.Background()

		exists, err := serviceAdd.CheckEmergencyExists(ctx, db, req.LicensePlateName)
		if err != nil {
			return c.Status(500).JSON(addUtils.AddEmergencyResponse{Success: false, Message: "ตรวจสอบข้อมูลไม่สำเร็จ"})
		}
		if exists {
			return c.Status(400).JSON(addUtils.AddEmergencyResponse{Success: false, Message: "ทะเบียนรถนี้มีในระบบแล้ว"})
		}

		emergencyID, err := serviceAdd.CreateEmergency(ctx, db, req.LicensePlateName, req.Type)
		if err != nil {
			return c.Status(500).JSON(addUtils.AddEmergencyResponse{Success: false, Message: err.Error()})
		}

		return c.Status(201).JSON(addUtils.AddEmergencyResponse{
			Success:     true,
			Message:     "เพิ่มรถฉุกเฉินสำเร็จ",
			EmergencyID: emergencyID,
		})
	}
}
