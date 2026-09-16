package mainUpdateEmergency

import (
	"context"
	"strings"

	handlerUpdate "go-fiber-check-ambu/src/controller/emergency/update/handler"
	serviceUpdate "go-fiber-check-ambu/src/controller/emergency/update/service"
	updateUtils "go-fiber-check-ambu/src/controller/emergency/update/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func UpdateEmergency(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req updateUtils.UpdateEmergencyRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(updateUtils.UpdateEmergencyResponse{Success: false, Message: "ข้อมูลไม่ถูกต้อง"})
		}

		if err := handlerUpdate.ValidateEmergencyID(req.EmergencyID); err != nil {
			return c.Status(400).JSON(updateUtils.UpdateEmergencyResponse{Success: false, Message: err.Error()})
		}

		req.LicensePlateName = strings.TrimSpace(req.LicensePlateName)
		req.Type = strings.ToUpper(strings.TrimSpace(req.Type))

		if req.LicensePlateName != "" {
			if err := handlerUpdate.ValidateLicensePlateName(req.LicensePlateName); err != nil {
				return c.Status(400).JSON(updateUtils.UpdateEmergencyResponse{Success: false, Message: err.Error()})
			}
		}
		if req.Type != "" {
			if err := handlerUpdate.ValidateType(req.Type); err != nil {
				return c.Status(400).JSON(updateUtils.UpdateEmergencyResponse{Success: false, Message: err.Error()})
			}
		}

		ctx := context.Background()

		exists, err := serviceUpdate.CheckEmergencyExists(ctx, db, req.EmergencyID)
		if err != nil {
			return c.Status(500).JSON(updateUtils.UpdateEmergencyResponse{Success: false, Message: "ตรวจสอบข้อมูลไม่สำเร็จ"})
		}
		if !exists {
			return c.Status(404).JSON(updateUtils.UpdateEmergencyResponse{Success: false, Message: "ไม่พบข้อมูลรถฉุกเฉินที่ต้องการแก้ไข"})
		}

		if req.LicensePlateName != "" {
			duplicate, err := serviceUpdate.CheckLicensePlateExists(ctx, db, req.LicensePlateName, req.EmergencyID)
			if err != nil {
				return c.Status(500).JSON(updateUtils.UpdateEmergencyResponse{Success: false, Message: "ตรวจสอบข้อมูลไม่สำเร็จ"})
			}
			if duplicate {
				return c.Status(400).JSON(updateUtils.UpdateEmergencyResponse{Success: false, Message: "ทะเบียนรถนี้มีในระบบแล้ว"})
			}
		}

		if err := serviceUpdate.UpdateEmergency(ctx, db, req.EmergencyID, req.LicensePlateName, req.Type, req.Active); err != nil {
			return c.Status(500).JSON(updateUtils.UpdateEmergencyResponse{Success: false, Message: err.Error()})
		}

		return c.Status(200).JSON(updateUtils.UpdateEmergencyResponse{Success: true, Message: "แก้ไขข้อมูลสำเร็จ"})
	}
}
