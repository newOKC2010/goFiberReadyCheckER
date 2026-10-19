package mainUpdateParcel

import (
	"context"
	"strings"

	handlerUpdate "go-fiber-check-ambu/src/controller/parcel/update/handler"
	serviceUpdate "go-fiber-check-ambu/src/controller/parcel/update/service"
	updateUtils "go-fiber-check-ambu/src/controller/parcel/update/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func UpdateParcel(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req updateUtils.UpdateParcelRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(updateUtils.UpdateParcelResponse{Success: false, Message: "ข้อมูลไม่ถูกต้อง"})
		}

		if err := handlerUpdate.ValidateParcelID(req.ParcelID); err != nil {
			return c.Status(400).JSON(updateUtils.UpdateParcelResponse{Success: false, Message: err.Error()})
		}

		req.Name = strings.TrimSpace(req.Name)

		ctx := context.Background()

		exists, err := serviceUpdate.CheckParcelExists(ctx, db, req.ParcelID)
		if err != nil {
			return c.Status(500).JSON(updateUtils.UpdateParcelResponse{Success: false, Message: "ตรวจสอบข้อมูลไม่สำเร็จ"})
		}
		if !exists {
			return c.Status(404).JSON(updateUtils.UpdateParcelResponse{Success: false, Message: "ไม่พบข้อมูลพัสดุ"})
		}

		if req.Name != "" {
			if err := handlerUpdate.ValidateName(req.Name); err != nil {
				return c.Status(400).JSON(updateUtils.UpdateParcelResponse{Success: false, Message: err.Error()})
			}
			dup, err := serviceUpdate.CheckNameExists(ctx, db, req.Name, req.ParcelID)
			if err != nil {
				return c.Status(500).JSON(updateUtils.UpdateParcelResponse{Success: false, Message: "ตรวจสอบข้อมูลไม่สำเร็จ"})
			}
			if dup {
				return c.Status(400).JSON(updateUtils.UpdateParcelResponse{Success: false, Message: "ชื่อพัสดุนี้มีในระบบแล้ว"})
			}
		}

		if err := serviceUpdate.UpdateParcel(ctx, db, req.ParcelID, req.Name, req.Active); err != nil {
			return c.Status(500).JSON(updateUtils.UpdateParcelResponse{Success: false, Message: err.Error()})
		}

		return c.Status(200).JSON(updateUtils.UpdateParcelResponse{Success: true, Message: "แก้ไขข้อมูลสำเร็จ"})
	}
}
