package routes

import (
	list "go-fiber-check-ambu/src/controller/userEr"
	middleware "go-fiber-check-ambu/src/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func SetupUserERRoutes(app fiber.Router, db *bun.DB) {
	userGroup := app.Group("/user", middleware.AuthGuards(db, []string{"admin", "super_admin"}))
	userGroup.Get("/list", list.ListAllStaff(db))
}
