package routes

import (
	dashboard "go-fiber-check-ambu/src/controller/dashboard"
	middleware "go-fiber-check-ambu/src/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func SetupDashboardRoutes(app fiber.Router, db *bun.DB) {
	prefix := app.Group("/dashboard")

	prefix.Get("/", middleware.AuthGuards(db, nil), dashboard.GetDashboard(db))
}
