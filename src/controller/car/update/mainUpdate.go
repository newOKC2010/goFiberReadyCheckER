package mainUpdateCar

import (
	"context"

	handlerUpdateCar "go-fiber-check-ambu/src/controller/car/update/handler"
	serviceUpdateCar "go-fiber-check-ambu/src/controller/car/update/service"
	updateCarUtils "go-fiber-check-ambu/src/controller/car/update/utils"
	"go-fiber-check-ambu/src/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func UpdateCar(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user_er").(*middleware.UserERInfo)

		if err := handlerUpdateCar.ValidateAdminRole(user.Role); err != nil {
			return c.Status(403).JSON(updateCarUtils.UpdateCarResponse{
				Success: false,
				Message: err.Error(),
			})
		}

		var req updateCarUtils.UpdateCarRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(updateCarUtils.UpdateCarResponse{
				Success: false,
				Message: "ข้อมูลไม่ถูกต้อง",
			})
		}

		if err := handlerUpdateCar.ValidateCarID(req.CarID); err != nil {
			return c.Status(400).JSON(updateCarUtils.UpdateCarResponse{
				Success: false,
				Message: err.Error(),
			})
		}

		if req.LicensePlateName != "" {
			if err := handlerUpdateCar.ValidateLicensePlateName(req.LicensePlateName); err != nil {
				return c.Status(400).JSON(updateCarUtils.UpdateCarResponse{
					Success: false,
					Message: err.Error(),
				})
			}
		}

		ctx := context.Background()

		exists, err := serviceUpdateCar.CheckCarExists(ctx, db, req.CarID)
		if err != nil {
			return c.Status(500).JSON(updateCarUtils.UpdateCarResponse{
				Success: false,
				Message: "ตรวจสอบข้อมูลไม่สำเร็จ",
			})
		}
		if !exists {
			return c.Status(404).JSON(updateCarUtils.UpdateCarResponse{
				Success: false,
				Message: "ไม่พบข้อมูลรถที่ต้องการแก้ไข",
			})
		}

		if req.LicensePlateName != "" {
			duplicate, err := serviceUpdateCar.CheckLicensePlateExists(ctx, db, req.LicensePlateName, req.CarID)
			if err != nil {
				return c.Status(500).JSON(updateCarUtils.UpdateCarResponse{
					Success: false,
					Message: "ตรวจสอบข้อมูลไม่สำเร็จ",
				})
			}
			if duplicate {
				return c.Status(400).JSON(updateCarUtils.UpdateCarResponse{
					Success: false,
					Message: "ทะเบียนรถนี้มีในระบบแล้ว",
				})
			}
		}

		if err := serviceUpdateCar.UpdateCar(ctx, db, req.CarID, req.LicensePlateName, req.Active); err != nil {
			return c.Status(500).JSON(updateCarUtils.UpdateCarResponse{
				Success: false,
				Message: err.Error(),
			})
		}

		return c.Status(200).JSON(updateCarUtils.UpdateCarResponse{
			Success: true,
			Message: "แก้ไขข้อมูลสำเร็จ",
		})
	}
}
