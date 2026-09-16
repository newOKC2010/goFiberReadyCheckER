package mainUpdateEmergencyList

import (
	"context"
	"strings"

	handlerUpdate "go-fiber-check-ambu/src/controller/emergencyList/update/handler"
	serviceUpdate "go-fiber-check-ambu/src/controller/emergencyList/update/service"
	updateUtils "go-fiber-check-ambu/src/controller/emergencyList/update/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func UpdateEmergencyList(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req updateUtils.UpdateEmergencyListRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(updateUtils.UpdateEmergencyListResponse{Success: false, Message: "ข้อมูลไม่ถูกต้อง"})
		}

		if err := handlerUpdate.ValidateEmergencyListID(req.EmergencyListID); err != nil {
			return c.Status(400).JSON(updateUtils.UpdateEmergencyListResponse{Success: false, Message: err.Error()})
		}

		req.Name = strings.TrimSpace(req.Name)

		if err := handlerUpdate.ValidateName(req.Name); err != nil {
			return c.Status(400).JSON(updateUtils.UpdateEmergencyListResponse{Success: false, Message: err.Error()})
		}

		ctx := context.Background()

		exists, err := serviceUpdate.CheckEmergencyListExists(ctx, db, req.EmergencyListID)
		if err != nil {
			return c.Status(500).JSON(updateUtils.UpdateEmergencyListResponse{Success: false, Message: "ตรวจสอบข้อมูลไม่สำเร็จ"})
		}
		if !exists {
			return c.Status(404).JSON(updateUtils.UpdateEmergencyListResponse{Success: false, Message: "ไม่พบรายการตรวจสอบที่ต้องการแก้ไข"})
		}

		duplicate, err := serviceUpdate.CheckNameExists(ctx, db, req.Name, req.EmergencyListID)
		if err != nil {
			return c.Status(500).JSON(updateUtils.UpdateEmergencyListResponse{Success: false, Message: "ตรวจสอบข้อมูลไม่สำเร็จ"})
		}
		if duplicate {
			return c.Status(400).JSON(updateUtils.UpdateEmergencyListResponse{Success: false, Message: "ชื่อรายการตรวจสอบนี้มีในระบบแล้ว"})
		}

		if err := serviceUpdate.UpdateEmergencyList(ctx, db, req.EmergencyListID, req.Name, req.Description, req.IsActive); err != nil {
			return c.Status(500).JSON(updateUtils.UpdateEmergencyListResponse{Success: false, Message: err.Error()})
		}

		return c.Status(200).JSON(updateUtils.UpdateEmergencyListResponse{Success: true, Message: "แก้ไขข้อมูลสำเร็จ"})
	}
}
