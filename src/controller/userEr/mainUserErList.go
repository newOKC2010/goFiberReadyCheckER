package list

import (
	"context"

	serviceList "go-fiber-check-ambu/src/controller/userEr/service"
	listUtils "go-fiber-check-ambu/src/controller/userEr/utils"
	middleware "go-fiber-check-ambu/src/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func ListAllStaff(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user_er").(*middleware.UserERInfo)

		if user.Role != "admin" && user.Role != "super_admin" {
			return c.Status(403).JSON(listUtils.ListStaffResponse{
				Success: false,
				Message: "ไม่มีสิทธิ์เข้าถึง",
			})
		}

		ctx := context.Background()
		staff, err := serviceList.GetAllStaff(ctx, db)

		if err != nil {
			return c.Status(500).JSON(listUtils.ListStaffResponse{
				Success: false,
				Message: "ดึงข้อมูลไม่สำเร็จ",
			})
		}

		return c.Status(200).JSON(listUtils.ListStaffResponse{
			Success: true,
			Message: "ดึงข้อมูลสำเร็จ",
			Data:    staff,
		})
	}
}
