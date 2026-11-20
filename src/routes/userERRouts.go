package routes

import (
	list "go-fiber-check-ambu/src/controller/userEr"
	updateUserEr "go-fiber-check-ambu/src/controller/userEr/update"
	middleware "go-fiber-check-ambu/src/middleware"
	ratelimit "go-fiber-check-ambu/src/middleware/rateLimit"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func SetupUserERRoutes(app fiber.Router, db *bun.DB) {
	userGroup := app.Group("/user", middleware.AuthGuards(db, []string{"admin", "super_admin"}))
	userGroup.Get("/list", ratelimit.RateLimitByUsers(30, 1*time.Minute), list.ListAllStaff(db))
	userGroup.Put("/update-status", updateUserEr.UpdateUserStatus(db))
}
