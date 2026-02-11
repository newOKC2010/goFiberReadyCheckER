package addMain

import (
	"context"
	"log"

	handlerAdd "go-fiber-check-ambu/src/controller/carChecked/add/handler"
	serviceAdd "go-fiber-check-ambu/src/controller/carChecked/add/service"
	addUtils "go-fiber-check-ambu/src/controller/carChecked/add/utils"
	"go-fiber-check-ambu/src/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func AddCarChecked(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user_er").(*middleware.UserERInfo)

		var req addUtils.AddCarCheckedRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(addUtils.AddCarCheckedResponse{
				Success: false,
				Message: "ข้อมูลไม่ถูกต้อง",
			})
		}

		if err := handlerAdd.ValidateCarID(req.CarID); err != nil {
			return c.Status(400).JSON(addUtils.AddCarCheckedResponse{
				Success: false,
				Message: err.Error(),
			})
		}

		ctx := context.Background()

		// if err := handlerAdd.ValidateCarNotCheckedToday(ctx, db, req.CarID); err != nil {
		// 	return c.Status(400).JSON(addUtils.AddCarCheckedResponse{
		// 		Success: false,
		// 		Message: err.Error(),
		// 	})
		// }

		car, err := serviceAdd.GetCarByID(ctx, db, req.CarID)
		if err != nil {
			return c.Status(404).JSON(addUtils.AddCarCheckedResponse{
				Success: false,
				Message: err.Error(),
			})
		}

		checklistItems, err := handlerAdd.ParseChecklistItems(req.ChecklistItems)
		if err != nil {
			return c.Status(400).JSON(addUtils.AddCarCheckedResponse{
				Success: false,
				Message: "รูปแบบ checklist_items ไม่ถูกต้อง",
			})
		}

		if err := handlerAdd.ValidateChecklistItems(checklistItems); err != nil {
			return c.Status(400).JSON(addUtils.AddCarCheckedResponse{
				Success: false,
				Message: err.Error(),
			})
		}

		form, err := c.MultipartForm()
		if err != nil {
			return c.Status(400).JSON(addUtils.AddCarCheckedResponse{
				Success: false,
				Message: "ไม่สามารถอ่านข้อมูล form ได้",
			})
		}

		if err := handlerAdd.ProcessFilesAndUpdateImages(c, form, checklistItems, user.ID); err != nil {
			return c.Status(500).JSON(addUtils.AddCarCheckedResponse{
				Success: false,
				Message: "จัดการไฟล์ไม่สำเร็จ: " + err.Error(),
			})
		}

		carCheckedID, err := serviceAdd.CreateCarChecked(ctx, db, car.ID, car.LicensePlateName, user.ID, checklistItems)
		if err != nil {
			return c.Status(500).JSON(addUtils.AddCarCheckedResponse{
				Success: false,
				Message: err.Error(),
			})
		}

		log.Printf("✅ เพิ่มข้อมูลการตรวจสอบรถสำเร็จ: ID=%d, Car=%s", carCheckedID, car.LicensePlateName)

		// handlerAdd.SendCarCheckedAlert(ctx, db, user.ID, car.LicensePlateName, *checklistItems)

		return c.Status(201).JSON(addUtils.AddCarCheckedResponse{
			Success: true,
			Message: "บันทึกข้อมูลสำเร็จ",
		})
	}
}
