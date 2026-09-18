package routes

import (
	mainAddEmergency "go-fiber-check-ambu/src/controller/emergency/add"
	mainUpdateEmergency "go-fiber-check-ambu/src/controller/emergency/update"
	mainViewsEmergency "go-fiber-check-ambu/src/controller/emergency/views"
	mainAddEmergencyChecked "go-fiber-check-ambu/src/controller/emergencyChecked/add"
	deleteEmergencyChecked "go-fiber-check-ambu/src/controller/emergencyChecked/delete"
	updateEmergencyChecked "go-fiber-check-ambu/src/controller/emergencyChecked/update"
	viewsEmergencyChecked "go-fiber-check-ambu/src/controller/emergencyChecked/views"
	imagesEmergencyChecked "go-fiber-check-ambu/src/controller/emergencyChecked/views/images"
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

	// emergency-checked (บันทึกผลการตรวจ)
	ec := app.Group("/emergency-checked")
	ec.Post("/add", middleware.AuthGuards(db, nil), ratelimit.RateLimitByUsers(30, 1*time.Minute), mainAddEmergencyChecked.AddEmergencyChecked(db))
	ec.Put("/update", middleware.AuthGuards(db, nil), ratelimit.RateLimitByUsers(20, 1*time.Minute), updateEmergencyChecked.UpdateEmergencyChecked(db))
	ec.Delete("/delete", middleware.AuthGuards(db, []string{"admin", "super_admin"}), ratelimit.RateLimitByUsers(10, 1*time.Minute), deleteEmergencyChecked.DeleteEmergencyChecked(db))
	ec.Get("/views", middleware.AuthGuards(db, nil), ratelimit.RateLimitByUsers(60, 1*time.Minute), viewsEmergencyChecked.ViewEmergencyChecked(db))
	ec.Get("/view-image/*", middleware.AuthGuards(db, nil), ratelimit.RateLimitByUsers(100, 1*time.Minute), imagesEmergencyChecked.ServeImage(db))
}
