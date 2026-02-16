package mainViewsChecklist

import (
	"context"

	serviceViewsChecklist "go-fiber-check-ambu/src/controller/checklist/views/service"
	viewsChecklistUtils "go-fiber-check-ambu/src/controller/checklist/views/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func ViewsChecklists(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {

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
