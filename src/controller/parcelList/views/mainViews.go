package mainViewsParcelList

import (
	"context"

	serviceViews "go-fiber-check-ambu/src/controller/parcelList/views/service"
	viewsUtils "go-fiber-check-ambu/src/controller/parcelList/views/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func ViewsParcelLists(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		ctx := context.Background()
		offset := c.QueryInt("offset", 0)
		limit := c.QueryInt("limit", 0)

		items, totalCount, err := serviceViews.GetAllParcelLists(ctx, db, offset, limit)
		if err != nil {
			return c.Status(500).JSON(viewsUtils.ViewsParcelListResponse{Success: false, Message: "ดึงข้อมูลไม่สำเร็จ"})
		}
		if totalCount == 0 {
			return c.Status(200).JSON(viewsUtils.ViewsParcelListResponse{Success: false, Message: "ไม่พบรายการตรวจสอบ"})
		}

		data := make([]viewsUtils.ParcelListResponse, len(items))
		for i, item := range items {
			data[i] = viewsUtils.ParcelListResponse{
				ID: item.ID, Name: item.Name, Description: item.Description,
				ItemType: item.ItemType, TrueLabel: item.TrueLabel, FalseLabel: item.FalseLabel,
				IsActive: item.IsActive, CreatedAt: item.CreatedAt, UpdatedAt: item.UpdatedAt,
			}
		}

		totalPages, currentPage := 0, 0
		if limit > 0 {
			totalPages = (totalCount + limit - 1) / limit
			currentPage = (offset / limit) + 1
		}

		return c.Status(200).JSON(viewsUtils.ViewsParcelListResponse{
			Success: true, Message: "ดึงข้อมูลสำเร็จ",
			Data: data, TotalCount: totalCount, TotalPages: totalPages, CurrentPage: currentPage,
		})
	}
}
