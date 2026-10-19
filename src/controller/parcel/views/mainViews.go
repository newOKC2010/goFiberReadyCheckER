package mainViewsParcel

import (
	"context"

	serviceViews "go-fiber-check-ambu/src/controller/parcel/views/service"
	viewsUtils "go-fiber-check-ambu/src/controller/parcel/views/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func ViewsParcels(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		ctx := context.Background()
		offset := c.QueryInt("offset", 0)
		limit := c.QueryInt("limit", 0)

		items, totalCount, err := serviceViews.GetAllParcels(ctx, db, offset, limit)
		if err != nil {
			return c.Status(500).JSON(viewsUtils.ViewsParcelResponse{Success: false, Message: "ดึงข้อมูลไม่สำเร็จ"})
		}
		if totalCount == 0 {
			return c.Status(200).JSON(viewsUtils.ViewsParcelResponse{Success: false, Message: "ไม่พบข้อมูลพัสดุ"})
		}

		data := make([]viewsUtils.ParcelResponse, len(items))
		for i, p := range items {
			data[i] = viewsUtils.ParcelResponse{ID: p.ID, Name: p.Name, Active: p.Active, CreatedAt: p.CreatedAt, UpdatedAt: p.UpdatedAt}
		}

		totalPages, currentPage := 0, 0
		if limit > 0 {
			totalPages = (totalCount + limit - 1) / limit
			currentPage = (offset / limit) + 1
		}

		return c.Status(200).JSON(viewsUtils.ViewsParcelResponse{
			Success: true, Message: "ดึงข้อมูลสำเร็จ",
			Data: data, TotalCount: totalCount, TotalPages: totalPages, CurrentPage: currentPage,
		})
	}
}
