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

		offset := c.QueryInt("offset", 0)
		limit := c.QueryInt("limit", 0)

		cars, totalCount, err := serviceViewsCar.GetAllCars(ctx, db, offset, limit)
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

		totalPages := 0
		currentPage := 0
		if limit > 0 {
			totalPages = (totalCount + limit - 1) / limit
			currentPage = (offset / limit) + 1
		}

		return c.Status(200).JSON(viewsCarUtils.ViewsCarsResponse{
			Success:     true,
			Message:     "ดึงข้อมูลสำเร็จ",
			Data:        carResponses,
			TotalCount:  totalCount,
			TotalPages:  totalPages,
			CurrentPage: currentPage,
		})
	}
}
