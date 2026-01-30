package routes

import (
	addMain "go-fiber-check-ambu/src/controller/carChecked/add"
	views "go-fiber-check-ambu/src/controller/carChecked/views"
	images "go-fiber-check-ambu/src/controller/carChecked/views/images"
	middleware "go-fiber-check-ambu/src/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func SetupCarCheckedRoutes(app fiber.Router, db *bun.DB) {
	prefix := app.Group("/car-checked")

	prefix.Post("/add", middleware.AuthGuards(db, nil), addMain.AddCarChecked(db))
	prefix.Get("/views", middleware.AuthGuards(db, nil), views.ViewCarChecked(db))
	prefix.Get("/view-image/*", middleware.AuthGuards(db, nil), images.ServeImage(db))
}
