package routes

import (
	mainAddEmergency "go-fiber-check-ambu/src/controller/emergency/add"
	mainUpdateEmergency "go-fiber-check-ambu/src/controller/emergency/update"
	mainViewsEmergency "go-fiber-check-ambu/src/controller/emergency/views"
	mainAddEmergencyList "go-fiber-check-ambu/src/controller/emergencyList/add"
	mainUpdateEmergencyList "go-fiber-check-ambu/src/controller/emergencyList/update"
	mainViewsEmergencyList "go-fiber-check-ambu/src/controller/emergencyList/views"
	"go-fiber-check-ambu/src/middleware"
	ratelimit "go-fiber-check-ambu/src/middleware/rateLimit"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func SetupEmergencyRoutes(app fiber.Router, db *bun.DB) {
	// emergency (รถฉุกเฉิน)
	em := app.Group("/emergency")
	em.Post("/add", middleware.AuthGuards(db, []string{"admin", "super_admin"}), ratelimit.RateLimitByUsers(10, 1*time.Minute), mainAddEmergency.AddEmergency(db))
	em.Put("/update", middleware.AuthGuards(db, []string{"admin", "super_admin"}), ratelimit.RateLimitByUsers(10, 1*time.Minute), mainUpdateEmergency.UpdateEmergency(db))
	em.Get("/views", middleware.AuthGuards(db, nil), ratelimit.RateLimitByUsers(60, 1*time.Minute), mainViewsEmergency.ViewsEmergencies(db))

	// emergency-list (รายการตรวจสอบ)
	el := app.Group("/emergency-list")
	el.Post("/add", middleware.AuthGuards(db, []string{"admin", "super_admin"}), ratelimit.RateLimitByUsers(10, 1*time.Minute), mainAddEmergencyList.AddEmergencyList(db))
	el.Put("/update", middleware.AuthGuards(db, []string{"admin", "super_admin"}), ratelimit.RateLimitByUsers(10, 1*time.Minute), mainUpdateEmergencyList.UpdateEmergencyList(db))
	el.Get("/views", middleware.AuthGuards(db, nil), ratelimit.RateLimitByUsers(60, 1*time.Minute), mainViewsEmergencyList.ViewsEmergencyLists(db))
}
