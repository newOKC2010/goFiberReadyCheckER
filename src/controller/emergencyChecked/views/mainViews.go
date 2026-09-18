package viewsEmergencyChecked

import (
	"context"

	handlerViews "go-fiber-check-ambu/src/controller/emergencyChecked/views/handler"
	serviceViews "go-fiber-check-ambu/src/controller/emergencyChecked/views/service"
	viewsUtils "go-fiber-check-ambu/src/controller/emergencyChecked/views/utils"
	"go-fiber-check-ambu/src/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func ViewEmergencyChecked(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user_er").(*middleware.UserERInfo)
		ctx := context.Background()

		filters := viewsUtils.FilterParams{
			ID:          c.Query("id"),
			DateFrom:    c.Query("date_from"),
			DateTo:      c.Query("date_to"),
			EmergencyID: c.Query("emergency_id"),
			StaffID:     c.Query("staff_id"),
			Offset:      c.QueryInt("offset", 0),
			Limit:       c.QueryInt("limit", 0),
		}

		if err := handlerViews.ValidateFilters(filters); err != nil {
			return c.Status(400).JSON(viewsUtils.ViewEmergencyCheckedResponse{Success: false, Message: err.Error()})
		}

		var data []viewsUtils.EmergencyCheckedData
		var totalCount int
		var err error

		if user.Role == "user" {
			data, totalCount, err = serviceViews.GetEmergencyCheckedByUserID(ctx, db, user.ID, filters)
		} else {
			data, totalCount, err = serviceViews.GetAllEmergencyChecked(ctx, db, filters)
		}

		if err != nil {
			return c.Status(500).JSON(viewsUtils.ViewEmergencyCheckedResponse{Success: false, Message: "ดึงข้อมูลไม่สำเร็จ"})
		}

		if len(data) == 0 {
			return c.Status(404).JSON(viewsUtils.ViewEmergencyCheckedResponse{Success: false, Message: "ไม่พบข้อมูล"})
		}

		response, err := handlerViews.FormatResponse(data, user.Role)
		if err != nil {
			return c.Status(500).JSON(viewsUtils.ViewEmergencyCheckedResponse{Success: false, Message: "ประมวลผลข้อมูลไม่สำเร็จ"})
		}

		totalPages, currentPage := 0, 0
		if filters.Limit > 0 {
			totalPages = (totalCount + filters.Limit - 1) / filters.Limit
			currentPage = (filters.Offset / filters.Limit) + 1
		}

		return c.Status(200).JSON(viewsUtils.ViewEmergencyCheckedResponse{
			Success:     true,
			Message:     "ดึงข้อมูลสำเร็จ",
			Data:        response,
			TotalCount:  totalCount,
			TotalPages:  totalPages,
			CurrentPage: currentPage,
		})
	}
}
