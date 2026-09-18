package deleteEmergencyChecked

import (
	"context"

	handlerDelete "go-fiber-check-ambu/src/controller/emergencyChecked/delete/handler"
	serviceDelete "go-fiber-check-ambu/src/controller/emergencyChecked/delete/service"
	deleteUtils "go-fiber-check-ambu/src/controller/emergencyChecked/delete/utils"
	"go-fiber-check-ambu/src/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func DeleteEmergencyChecked(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user_er").(*middleware.UserERInfo)

		if err := handlerDelete.ValidateAdminRole(user.Role); err != nil {
			return c.Status(403).JSON(deleteUtils.DeleteEmergencyCheckedResponse{Success: false, Message: err.Error()})
		}

		var req deleteUtils.DeleteEmergencyCheckedRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(deleteUtils.DeleteEmergencyCheckedResponse{Success: false, Message: "ข้อมูลไม่ถูกต้อง"})
		}

		if err := handlerDelete.ValidateEmergencyCheckedID(req.EmergencyCheckedID); err != nil {
			return c.Status(400).JSON(deleteUtils.DeleteEmergencyCheckedResponse{Success: false, Message: err.Error()})
		}

		ctx := context.Background()

		exists, err := serviceDelete.CheckEmergencyCheckedExists(ctx, db, req.EmergencyCheckedID)
		if err != nil {
			return c.Status(500).JSON(deleteUtils.DeleteEmergencyCheckedResponse{Success: false, Message: "ตรวจสอบข้อมูลไม่สำเร็จ"})
		}
		if !exists {
			return c.Status(404).JSON(deleteUtils.DeleteEmergencyCheckedResponse{Success: false, Message: "ไม่พบข้อมูลที่ต้องการลบ"})
		}

		if err := serviceDelete.SoftDeleteEmergencyChecked(ctx, db, req.EmergencyCheckedID); err != nil {
			return c.Status(500).JSON(deleteUtils.DeleteEmergencyCheckedResponse{Success: false, Message: err.Error()})
		}

		return c.Status(200).JSON(deleteUtils.DeleteEmergencyCheckedResponse{Success: true, Message: "ลบข้อมูลสำเร็จ"})
	}
}
