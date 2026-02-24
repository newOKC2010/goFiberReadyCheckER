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

		offset := c.QueryInt("offset", 0)
		limit := c.QueryInt("limit", 0)

		filters := viewsUtils.FilterParams{
			ID:       c.Query("id"),
			DateFrom: c.Query("date_from"),
			DateTo:   c.Query("date_to"),
			CarID:    c.Query("car_id"),
			StaffID:  c.Query("staff_id"),
			Offset:   offset,
			Limit:    limit,
		}

		if err := handlerViews.ValidateFilters(filters); err != nil {
			return c.Status(400).JSON(viewsUtils.ViewCarCheckedResponse{
				Success: false,
				Message: err.Error(),
			})
		}

		var data []viewsUtils.CarCheckedData
		var totalCount int
		var err error

		if user.Role == "user" {
			data, totalCount, err = serviceViews.GetCarCheckedByUserID(ctx, db, user.ID, filters)
		} else {
			data, totalCount, err = serviceViews.GetAllCarChecked(ctx, db, filters)
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

		totalPages := 0
		currentPage := 0
		if limit > 0 {
			totalPages = (totalCount + limit - 1) / limit
			currentPage = (offset / limit) + 1
		}

		return c.Status(200).JSON(viewsUtils.ViewCarCheckedResponse{
			Success:     true,
			Message:     "ดึงข้อมูลสำเร็จ",
			Data:        response,
			TotalCount:  totalCount,
			TotalPages:  totalPages,
			CurrentPage: currentPage,
		})
	}
}
