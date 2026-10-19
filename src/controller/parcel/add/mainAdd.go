package mainAddParcel

import (
	"context"
	"strings"

	handlerAdd "go-fiber-check-ambu/src/controller/parcel/add/handler"
	serviceAdd "go-fiber-check-ambu/src/controller/parcel/add/service"
	addUtils "go-fiber-check-ambu/src/controller/parcel/add/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func AddParcel(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req addUtils.AddParcelRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(addUtils.AddParcelResponse{Success: false, Message: "ข้อมูลไม่ถูกต้อง"})
		}

		req.Name = strings.TrimSpace(req.Name)
		if err := handlerAdd.ValidateName(req.Name); err != nil {
			return c.Status(400).JSON(addUtils.AddParcelResponse{Success: false, Message: err.Error()})
		}

		ctx := context.Background()

		exists, err := serviceAdd.CheckParcelExists(ctx, db, req.Name)
		if err != nil {
			return c.Status(500).JSON(addUtils.AddParcelResponse{Success: false, Message: "ตรวจสอบข้อมูลไม่สำเร็จ"})
		}
		if exists {
			return c.Status(400).JSON(addUtils.AddParcelResponse{Success: false, Message: "ชื่อพัสดุนี้มีในระบบแล้ว"})
		}

		parcelID, err := serviceAdd.CreateParcel(ctx, db, req.Name)
		if err != nil {
			return c.Status(500).JSON(addUtils.AddParcelResponse{Success: false, Message: err.Error()})
		}

		return c.Status(201).JSON(addUtils.AddParcelResponse{Success: true, Message: "เพิ่มข้อมูลพัสดุสำเร็จ", ParcelID: parcelID})
	}
}
