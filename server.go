package main

import (
	"log"

	"github.com/gofiber/fiber/v2"

	cors "go-fiber-check-ambu/src/controller/cors"
	conn "go-fiber-check-ambu/src/database/connection"
	loadenv "go-fiber-check-ambu/src/loadEnv"
)

func main() {
	port := loadenv.LoadPort()
	if port == "" {
		log.Fatal("PORT is not set")
	}

	conn.ConnectDB()

	app := fiber.New()
	cors.CorsConfig(app)
	log.Printf("Server started on port: %s", port)

	// routes.SetupAuthRoutes(app, conn.Db)
	// routes.SetupUserManageRoutes(app, conn.Db)

	if err := app.Listen(":" + port); err != nil {
		log.Fatal(err)
	}
}
