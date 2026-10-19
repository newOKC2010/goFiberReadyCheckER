package mainAddParcelList

import (
	"context"
	"strings"

	handlerAdd "go-fiber-check-ambu/src/controller/parcelList/add/handler"
	serviceAdd "go-fiber-check-ambu/src/controller/parcelList/add/service"
	addUtils "go-fiber-check-ambu/src/controller/parcelList/add/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func AddParcelList(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req addUtils.AddParcelListRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(addUtils.AddParcelListResponse{Success: false, Message: "ข้อมูลไม่ถูกต้อง"})
		}

		req.Name = strings.TrimSpace(req.Name)
		if err := handlerAdd.ValidateName(req.Name); err != nil {
			return c.Status(400).JSON(addUtils.AddParcelListResponse{Success: false, Message: err.Error()})
		}

		ctx := context.Background()

		exists, err := serviceAdd.CheckParcelListExists(ctx, db, req.Name)
		if err != nil {
			return c.Status(500).JSON(addUtils.AddParcelListResponse{Success: false, Message: "ตรวจสอบข้อมูลไม่สำเร็จ"})
		}
		if exists {
			return c.Status(400).JSON(addUtils.AddParcelListResponse{Success: false, Message: "ชื่อรายการนี้มีในระบบแล้ว"})
		}

		id, err := serviceAdd.CreateParcelList(ctx, db, req.Name, req.Description, req.ItemType, req.TrueLabel, req.FalseLabel)
		if err != nil {
			return c.Status(500).JSON(addUtils.AddParcelListResponse{Success: false, Message: err.Error()})
		}

		return c.Status(201).JSON(addUtils.AddParcelListResponse{Success: true, Message: "เพิ่มรายการตรวจสอบสำเร็จ", ParcelListID: id})
	}
}
