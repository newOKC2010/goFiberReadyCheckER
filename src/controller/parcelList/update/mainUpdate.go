package mainUpdateParcelList

import (
	"context"
	"strings"

	handlerUpdate "go-fiber-check-ambu/src/controller/parcelList/update/handler"
	serviceUpdate "go-fiber-check-ambu/src/controller/parcelList/update/service"
	updateUtils "go-fiber-check-ambu/src/controller/parcelList/update/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func UpdateParcelList(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req updateUtils.UpdateParcelListRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(updateUtils.UpdateParcelListResponse{Success: false, Message: "ข้อมูลไม่ถูกต้อง"})
		}

		if err := handlerUpdate.ValidateParcelListID(req.ParcelListID); err != nil {
			return c.Status(400).JSON(updateUtils.UpdateParcelListResponse{Success: false, Message: err.Error()})
		}

		req.Name = strings.TrimSpace(req.Name)
		if err := handlerUpdate.ValidateName(req.Name); err != nil {
			return c.Status(400).JSON(updateUtils.UpdateParcelListResponse{Success: false, Message: err.Error()})
		}

		ctx := context.Background()

		exists, err := serviceUpdate.CheckParcelListExists(ctx, db, req.ParcelListID)
		if err != nil {
			return c.Status(500).JSON(updateUtils.UpdateParcelListResponse{Success: false, Message: "ตรวจสอบข้อมูลไม่สำเร็จ"})
		}
		if !exists {
			return c.Status(404).JSON(updateUtils.UpdateParcelListResponse{Success: false, Message: "ไม่พบรายการตรวจสอบ"})
		}

		dup, err := serviceUpdate.CheckNameExists(ctx, db, req.Name, req.ParcelListID)
		if err != nil {
			return c.Status(500).JSON(updateUtils.UpdateParcelListResponse{Success: false, Message: "ตรวจสอบข้อมูลไม่สำเร็จ"})
		}
		if dup {
			return c.Status(400).JSON(updateUtils.UpdateParcelListResponse{Success: false, Message: "ชื่อรายการนี้มีในระบบแล้ว"})
		}

		if err := serviceUpdate.UpdateParcelList(ctx, db, req.ParcelListID, req.Name, req.Description, req.ItemType, req.TrueLabel, req.FalseLabel, req.IsActive); err != nil {
			return c.Status(500).JSON(updateUtils.UpdateParcelListResponse{Success: false, Message: err.Error()})
		}

		return c.Status(200).JSON(updateUtils.UpdateParcelListResponse{Success: true, Message: "แก้ไขข้อมูลสำเร็จ"})
	}
}
