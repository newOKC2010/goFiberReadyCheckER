package routes

import (
	addMain "go-fiber-check-ambu/src/controller/carChecked/add"
	middleware "go-fiber-check-ambu/src/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func SetupCarCheckedRoutes(app fiber.Router, db *bun.DB) {
	prefix := app.Group("/car-checked")

	prefix.Post("/add", middleware.AuthGuards(db, nil), addMain.AddCarChecked(db))
}
