package mainViewsEmergency

import (
	"context"

	serviceViews "go-fiber-check-ambu/src/controller/emergency/views/service"
	viewsUtils "go-fiber-check-ambu/src/controller/emergency/views/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func ViewsEmergencies(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		ctx := context.Background()

		emergencyType := c.Query("type", "")
		offset := c.QueryInt("offset", 0)
		limit := c.QueryInt("limit", 0)

		items, totalCount, err := serviceViews.GetAllEmergencies(ctx, db, emergencyType, offset, limit)
		if err != nil {
			return c.Status(500).JSON(viewsUtils.ViewsEmergencyResponse{
				Success: false,
				Message: "ดึงข้อมูลไม่สำเร็จ",
			})
		}

		if totalCount == 0 {
			return c.Status(200).JSON(viewsUtils.ViewsEmergencyResponse{
				Success: false,
				Message: "ไม่พบข้อมูลรถฉุกเฉิน",
			})
		}

		data := make([]viewsUtils.EmergencyResponse, len(items))
		for i, em := range items {
			data[i] = viewsUtils.EmergencyResponse{
				ID:               em.ID,
				LicensePlateName: em.LicensePlateName,
				Type:             em.Type,
				Active:           em.Active,
				CreatedAt:        em.CreatedAt,
				UpdatedAt:        em.UpdatedAt,
			}
		}

		totalPages, currentPage := 0, 0
		if limit > 0 {
			totalPages = (totalCount + limit - 1) / limit
			currentPage = (offset / limit) + 1
		}

		return c.Status(200).JSON(viewsUtils.ViewsEmergencyResponse{
			Success:     true,
			Message:     "ดึงข้อมูลสำเร็จ",
			Data:        data,
			TotalCount:  totalCount,
			TotalPages:  totalPages,
			CurrentPage: currentPage,
		})
	}
}
