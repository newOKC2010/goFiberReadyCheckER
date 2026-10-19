package deleteParcelChecked

import (
	"context"

	handlerDelete "go-fiber-check-ambu/src/controller/parcelChecked/delete/handler"
	serviceDelete "go-fiber-check-ambu/src/controller/parcelChecked/delete/service"
	deleteUtils "go-fiber-check-ambu/src/controller/parcelChecked/delete/utils"
	"go-fiber-check-ambu/src/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func DeleteParcelChecked(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user_er").(*middleware.UserERInfo)

		if err := handlerDelete.ValidateAdminRole(user.Role); err != nil {
			return c.Status(403).JSON(deleteUtils.DeleteParcelCheckedResponse{Success: false, Message: err.Error()})
		}

		var req deleteUtils.DeleteParcelCheckedRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(deleteUtils.DeleteParcelCheckedResponse{Success: false, Message: "ข้อมูลไม่ถูกต้อง"})
		}

		if err := handlerDelete.ValidateParcelCheckedID(req.ParcelCheckedID); err != nil {
			return c.Status(400).JSON(deleteUtils.DeleteParcelCheckedResponse{Success: false, Message: err.Error()})
		}

		ctx := context.Background()

		exists, err := serviceDelete.CheckParcelCheckedExists(ctx, db, req.ParcelCheckedID)
		if err != nil {
			return c.Status(500).JSON(deleteUtils.DeleteParcelCheckedResponse{Success: false, Message: "ตรวจสอบข้อมูลไม่สำเร็จ"})
		}
		if !exists {
			return c.Status(404).JSON(deleteUtils.DeleteParcelCheckedResponse{Success: false, Message: "ไม่พบข้อมูลที่ต้องการลบ"})
		}

		if err := serviceDelete.SoftDeleteParcelChecked(ctx, db, req.ParcelCheckedID); err != nil {
			return c.Status(500).JSON(deleteUtils.DeleteParcelCheckedResponse{Success: false, Message: err.Error()})
		}

		return c.Status(200).JSON(deleteUtils.DeleteParcelCheckedResponse{Success: true, Message: "ลบข้อมูลสำเร็จ"})
	}
}
