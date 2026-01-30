package images

import (
	"context"
	"path/filepath"

	serviceImages "go-fiber-check-ambu/src/controller/carChecked/views/images/service"
	loadEnv "go-fiber-check-ambu/src/loadEnv"
	middleware "go-fiber-check-ambu/src/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func ServeImage(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user_er").(*middleware.UserERInfo)
		imagePath := c.Params("*")

		if imagePath == "" {
			return c.Status(400).JSON(fiber.Map{
				"success": false,
				"message": "ไม่พบ path รูปภาพ",
			})
		}

		ctx := context.Background()
		isAdmin := user.Role == "admin" || user.Role == "super_admin"

		if !isAdmin {
			hasAccess, err := serviceImages.CheckImageAccess(ctx, db, imagePath, user.ID)
			if err != nil || !hasAccess {
				return c.Status(403).JSON(fiber.Map{
					"success": false,
					"message": "ไม่มีสิทธิ์เข้าถึงรูปภาพนี้",
				})
			}
		}

		uploadPath := loadEnv.LoadUploadPath()
		fullPath := filepath.Join(uploadPath, imagePath)

		return c.SendFile(fullPath)
	}
}
