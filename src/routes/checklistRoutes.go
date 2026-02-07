package routes

import (
	mainAddChecklist "go-fiber-check-ambu/src/controller/checklist/add"
	mainUpdateChecklist "go-fiber-check-ambu/src/controller/checklist/update"
	mainViewsChecklist "go-fiber-check-ambu/src/controller/checklist/views"
	"go-fiber-check-ambu/src/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func SetupChecklistRoutes(app fiber.Router, db *bun.DB) {
	prefix := app.Group("/checklist")

	prefix.Post("/add", middleware.AuthGuards(db, nil), mainAddChecklist.AddChecklist(db))
	prefix.Put("/update", middleware.AuthGuards(db, nil), mainUpdateChecklist.UpdateChecklist(db))
	prefix.Get("/views", middleware.AuthGuards(db, nil), mainViewsChecklist.ViewsChecklists(db))
}
