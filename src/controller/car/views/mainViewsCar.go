package mainViewsCar

import (
	"context"

	serviceViewsCar "go-fiber-check-ambu/src/controller/car/views/service"
	viewsCarUtils "go-fiber-check-ambu/src/controller/car/views/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func ViewsCars(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
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
