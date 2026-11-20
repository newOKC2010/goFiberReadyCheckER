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

		offset := c.QueryInt("offset", 0)
		limit := c.QueryInt("limit", 0)
		filter := serviceList.StaffFilter{
			Search: c.Query("search"),
			Role:   c.Query("role"),
			Status: c.Query("status"),
		}

		ctx := context.Background()
		staff, totalCount, err := serviceList.GetAllStaff(ctx, db, user.Role, offset, limit, filter)

		if err != nil {
			return c.Status(500).JSON(listUtils.ListStaffResponse{
				Success: false,
				Message: "ดึงข้อมูลไม่สำเร็จ",
			})
		}

		totalPages := 0
		currentPage := 1
		if limit > 0 {
			totalPages = (totalCount + limit - 1) / limit
			currentPage = (offset / limit) + 1
		}

		return c.Status(200).JSON(listUtils.ListStaffResponse{
			Success:     true,
			Message:     "ดึงข้อมูลสำเร็จ",
			Data:        staff,
			TotalCount:  totalCount,
			TotalPages:  totalPages,
			CurrentPage: currentPage,
		})
	}
}
