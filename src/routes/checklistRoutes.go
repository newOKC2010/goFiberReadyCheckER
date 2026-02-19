package routes

import (
	mainAddChecklist "go-fiber-check-ambu/src/controller/checklist/add"
	mainUpdateChecklist "go-fiber-check-ambu/src/controller/checklist/update"
	mainViewsChecklist "go-fiber-check-ambu/src/controller/checklist/views"
	"go-fiber-check-ambu/src/middleware"
	ratelimit "go-fiber-check-ambu/src/middleware/rateLimit"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func SetupChecklistRoutes(app fiber.Router, db *bun.DB) {
	prefix := app.Group("/checklist")

	prefix.Post("/add", middleware.AuthGuards(db, []string{"admin", "super_admin"}), ratelimit.RateLimitByUsers(10, 1*time.Minute), mainAddChecklist.AddChecklist(db))
	prefix.Put("/update", middleware.AuthGuards(db, []string{"admin", "super_admin"}), ratelimit.RateLimitByUsers(10, 1*time.Minute), mainUpdateChecklist.UpdateChecklist(db))
	prefix.Get("/views", middleware.AuthGuards(db, nil), ratelimit.RateLimitByUsers(60, 1*time.Minute), mainViewsChecklist.ViewsChecklists(db))
}
