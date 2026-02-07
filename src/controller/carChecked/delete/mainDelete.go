package deleteMain

import (
	"context"

	handlerDelete "go-fiber-check-ambu/src/controller/carChecked/delete/handler"
	serviceDelete "go-fiber-check-ambu/src/controller/carChecked/delete/service"
	deleteUtils "go-fiber-check-ambu/src/controller/carChecked/delete/utils"
	"go-fiber-check-ambu/src/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func DeleteCarChecked(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user_er").(*middleware.UserERInfo)

		if err := handlerDelete.ValidateAdminRole(user.Role); err != nil {
			return c.Status(403).JSON(deleteUtils.DeleteCarCheckedResponse{
				Success: false,
				Message: err.Error(),
			})
		}

		var req deleteUtils.DeleteCarCheckedRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(deleteUtils.DeleteCarCheckedResponse{
				Success: false,
				Message: "ข้อมูลไม่ถูกต้อง",
			})
		}

		if err := handlerDelete.ValidateCarCheckedID(req.CarCheckedID); err != nil {
			return c.Status(400).JSON(deleteUtils.DeleteCarCheckedResponse{
				Success: false,
				Message: err.Error(),
			})
		}

		ctx := context.Background()

		exists, err := serviceDelete.CheckCarCheckedExists(ctx, db, req.CarCheckedID)
		if err != nil {
			return c.Status(500).JSON(deleteUtils.DeleteCarCheckedResponse{
				Success: false,
				Message: "ตรวจสอบข้อมูลไม่สำเร็จ",
			})
		}
		if !exists {
			return c.Status(404).JSON(deleteUtils.DeleteCarCheckedResponse{
				Success: false,
				Message: "ไม่พบข้อมูลที่ต้องการลบ",
			})
		}

		if err := serviceDelete.SoftDeleteCarChecked(ctx, db, req.CarCheckedID); err != nil {
			return c.Status(500).JSON(deleteUtils.DeleteCarCheckedResponse{
				Success: false,
				Message: err.Error(),
			})
		}

		return c.Status(200).JSON(deleteUtils.DeleteCarCheckedResponse{
			Success: true,
			Message: "ลบข้อมูลสำเร็จ",
		})
	}
}
