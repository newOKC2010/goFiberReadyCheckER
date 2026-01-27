package routes

import (
	loginMain "go-fiber-check-ambu/src/controller/auth/login"
	registerMain "go-fiber-check-ambu/src/controller/auth/register"
	middleware "go-fiber-check-ambu/src/middleware"
	_ "go-fiber-check-ambu/src/middleware/rateLimit"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func SetupAuthRoutes(app fiber.Router, db *bun.DB) {
	prefix := app.Group("/auth")

	// prefix.Post("/req", ratelimit.RateLimitByEmail(10, 10*time.Minute), loginMain.RequestOTP(db))
	// prefix.Post("/verify", ratelimit.RateLimitByEmail(10, 10*time.Minute), loginMain.VerifyOTP(db))
	// prefix.Get("/status", middleware.AuthGuards(db, nil), func(c *fiber.Ctx) error {
	// 	user := c.Locals("user_er").(*middleware.UserERInfo)
	// 	return c.JSON(struct {
	// 		Success bool                   `json:"success"`
	// 		User    *middleware.UserERInfo `json:"user"`
	// 	}{
	// 		Success: true,
	// 		User:    user,
	// 	})
	// })

	prefix.Post("/req", loginMain.RequestOTP(db))
	prefix.Post("/verify", loginMain.VerifyOTP(db))
	prefix.Post("/register", registerMain.Register(db))
	prefix.Get("/status", middleware.AuthGuards(db, nil), func(c *fiber.Ctx) error {
		user := c.Locals("user_er").(*middleware.UserERInfo)
		return c.JSON(struct {
			Success bool                   `json:"success"`
			User    *middleware.UserERInfo `json:"user"`
		}{
			Success: true,
			User:    user,
		})
	})

}
