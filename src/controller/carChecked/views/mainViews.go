package views

import (
	"context"

	handlerViews "go-fiber-check-ambu/src/controller/carChecked/views/handler"
	serviceViews "go-fiber-check-ambu/src/controller/carChecked/views/service"
	viewsUtils "go-fiber-check-ambu/src/controller/carChecked/views/utils"
	middleware "go-fiber-check-ambu/src/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func ViewCarChecked(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user_er").(*middleware.UserERInfo)
		ctx := context.Background()

		var data []viewsUtils.CarCheckedData
		var err error

		if user.Role == "user" {
			data, err = serviceViews.GetCarCheckedByUserID(ctx, db, user.ID)
		} else {
			data, err = serviceViews.GetAllCarChecked(ctx, db)
		}

		if err != nil {
			return c.Status(500).JSON(viewsUtils.ViewCarCheckedResponse{
				Success: false,
				Message: "ดึงข้อมูลไม่สำเร็จ",
			})
		}

		if len(data) == 0 {
			return c.Status(404).JSON(viewsUtils.ViewCarCheckedResponse{
				Success: false,
				Message: "ไม่พบข้อมูล",
			})
		}

		response, err := handlerViews.FormatResponse(data, user.Role)
		if err != nil {
			return c.Status(500).JSON(viewsUtils.ViewCarCheckedResponse{
				Success: false,
				Message: "ประมวลผลข้อมูลไม่สำเร็จ",
			})
		}

		return c.Status(200).JSON(viewsUtils.ViewCarCheckedResponse{
			Success: true,
			Message: "ดึงข้อมูลสำเร็จ",
			Data:    response,
		})
	}
}
