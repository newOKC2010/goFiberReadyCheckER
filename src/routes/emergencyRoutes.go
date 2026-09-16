package routes

import (
	mainAddEmergency "go-fiber-check-ambu/src/controller/emergency/add"
	mainUpdateEmergency "go-fiber-check-ambu/src/controller/emergency/update"
	mainViewsEmergency "go-fiber-check-ambu/src/controller/emergency/views"
	"go-fiber-check-ambu/src/middleware"
	ratelimit "go-fiber-check-ambu/src/middleware/rateLimit"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func SetupEmergencyRoutes(app fiber.Router, db *bun.DB) {
	prefix := app.Group("/emergency")

	prefix.Post("/add", middleware.AuthGuards(db, []string{"admin", "super_admin"}), ratelimit.RateLimitByUsers(10, 1*time.Minute), mainAddEmergency.AddEmergency(db))
	prefix.Put("/update", middleware.AuthGuards(db, []string{"admin", "super_admin"}), ratelimit.RateLimitByUsers(10, 1*time.Minute), mainUpdateEmergency.UpdateEmergency(db))
	prefix.Get("/views", middleware.AuthGuards(db, nil), ratelimit.RateLimitByUsers(60, 1*time.Minute), mainViewsEmergency.ViewsEmergencies(db))
}
