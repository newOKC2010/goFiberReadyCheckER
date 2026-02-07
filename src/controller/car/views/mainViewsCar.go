package mainViewsCar

import (
	"context"

	handlerViewsCar "go-fiber-check-ambu/src/controller/car/views/handler"
	serviceViewsCar "go-fiber-check-ambu/src/controller/car/views/service"
	viewsCarUtils "go-fiber-check-ambu/src/controller/car/views/utils"
	"go-fiber-check-ambu/src/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func ViewsCars(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user_er").(*middleware.UserERInfo)

		if err := handlerViewsCar.ValidateAdminRole(user.Role); err != nil {
			return c.Status(403).JSON(viewsCarUtils.ViewsCarsResponse{
				Success: false,
				Message: err.Error(),
			})
		}

		ctx := context.Background()

		cars, err := serviceViewsCar.GetAllCars(ctx, db)
		if err != nil {
			return c.Status(500).JSON(viewsCarUtils.ViewsCarsResponse{
				Success: false,
				Message: "ดึงข้อมูลไม่สำเร็จ",
			})
		}

		carResponses := make([]viewsCarUtils.CarResponse, len(cars))
		for i, car := range cars {
			carResponses[i] = viewsCarUtils.CarResponse{
				ID:               car.ID,
				LicensePlateName: car.LicensePlateName,
				Active:           car.Active,
				CreatedAt:        car.CreatedAt,
				UpdatedAt:        car.UpdatedAt,
			}
		}

		return c.Status(200).JSON(viewsCarUtils.ViewsCarsResponse{
			Success: true,
			Message: "ดึงข้อมูลสำเร็จ",
			Data:    carResponses,
		})
	}
}
