package routes

import (
	mainAddCar "go-fiber-check-ambu/src/controller/car/add"
	mainUpdateCar "go-fiber-check-ambu/src/controller/car/update"
	mainViewsCar "go-fiber-check-ambu/src/controller/car/views"
	"go-fiber-check-ambu/src/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func SetupCarRoutes(app fiber.Router, db *bun.DB) {
	prefix := app.Group("/car")

	prefix.Post("/add", middleware.AuthGuards(db, []string{"admin", "super_admin"}), mainAddCar.AddCar(db))
	prefix.Put("/update", middleware.AuthGuards(db, []string{"admin", "super_admin"}), mainUpdateCar.UpdateCar(db))
	prefix.Get("/views", middleware.AuthGuards(db, nil), mainViewsCar.ViewsCars(db))
}
