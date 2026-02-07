package mainAddCar

import (
	"context"

	handlerAddCar "go-fiber-check-ambu/src/controller/car/add/handler"
	serviceAddCar "go-fiber-check-ambu/src/controller/car/add/service"
	addCarUtils "go-fiber-check-ambu/src/controller/car/add/utils"
	"go-fiber-check-ambu/src/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func AddCar(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user_er").(*middleware.UserERInfo)

		if err := handlerAddCar.ValidateAdminRole(user.Role); err != nil {
			return c.Status(403).JSON(addCarUtils.AddCarResponse{
				Success: false,
				Message: err.Error(),
			})
		}

		var req addCarUtils.AddCarRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(addCarUtils.AddCarResponse{
				Success: false,
				Message: "ข้อมูลไม่ถูกต้อง",
			})
		}

		if err := handlerAddCar.ValidateLicensePlateName(req.LicensePlateName); err != nil {
			return c.Status(400).JSON(addCarUtils.AddCarResponse{
				Success: false,
				Message: err.Error(),
			})
		}

		ctx := context.Background()

		exists, err := serviceAddCar.CheckCarExists(ctx, db, req.LicensePlateName)
		if err != nil {
			return c.Status(500).JSON(addCarUtils.AddCarResponse{
				Success: false,
				Message: "ตรวจสอบข้อมูลไม่สำเร็จ",
			})
		}
		if exists {
			return c.Status(400).JSON(addCarUtils.AddCarResponse{
				Success: false,
				Message: "ทะเบียนรถนี้มีในระบบแล้ว",
			})
		}

		carID, err := serviceAddCar.CreateCar(ctx, db, req.LicensePlateName)
		if err != nil {
			return c.Status(500).JSON(addCarUtils.AddCarResponse{
				Success: false,
				Message: err.Error(),
			})
		}

		return c.Status(201).JSON(addCarUtils.AddCarResponse{
			Success: true,
			Message: "เพิ่มรถสำเร็จ",
			CarID:   carID,
		})
	}
}
