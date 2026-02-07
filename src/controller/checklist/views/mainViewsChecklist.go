package mainViewsChecklist

import (
	"context"

	handlerViewsChecklist "go-fiber-check-ambu/src/controller/checklist/views/handler"
	serviceViewsChecklist "go-fiber-check-ambu/src/controller/checklist/views/service"
	viewsChecklistUtils "go-fiber-check-ambu/src/controller/checklist/views/utils"
	"go-fiber-check-ambu/src/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func ViewsChecklists(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user_er").(*middleware.UserERInfo)

		if err := handlerViewsChecklist.ValidateAdminRole(user.Role); err != nil {
			return c.Status(403).JSON(viewsChecklistUtils.ViewsChecklistsResponse{
				Success: false,
				Message: err.Error(),
			})
		}

		ctx := context.Background()

		checklists, err := serviceViewsChecklist.GetAllChecklists(ctx, db)
		if err != nil {
			return c.Status(500).JSON(viewsChecklistUtils.ViewsChecklistsResponse{
				Success: false,
				Message: "ดึงข้อมูลไม่สำเร็จ",
			})
		}

		checklistResponses := make([]viewsChecklistUtils.ChecklistResponse, len(checklists))
		for i, checklist := range checklists {
			checklistResponses[i] = viewsChecklistUtils.ChecklistResponse{
				ID:        checklist.ID,
				Name:      checklist.Name,
				IsActive:  checklist.IsActive,
				CreatedAt: checklist.CreatedAt,
				UpdatedAt: checklist.UpdatedAt,
			}
		}

		return c.Status(200).JSON(viewsChecklistUtils.ViewsChecklistsResponse{
			Success: true,
			Message: "ดึงข้อมูลสำเร็จ",
			Data:    checklistResponses,
		})
	}
}
