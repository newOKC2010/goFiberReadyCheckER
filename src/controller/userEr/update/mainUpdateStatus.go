package updateUserEr

import (
	"context"
	"log"

	emailAlert "go-fiber-check-ambu/src/controller/alert/email"
	handlerEmailAlert "go-fiber-check-ambu/src/controller/alert/email/handler"
	mophAlert "go-fiber-check-ambu/src/controller/alert/moph"
	handlerMophAlert "go-fiber-check-ambu/src/controller/alert/moph/handler"
	mophAlertUtils "go-fiber-check-ambu/src/controller/alert/moph/utils"
	serviceUpdate "go-fiber-check-ambu/src/controller/userEr/update/service"
	updateUtils "go-fiber-check-ambu/src/controller/userEr/update/utils"
	middleware "go-fiber-check-ambu/src/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func UpdateUserStatus(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		caller := c.Locals("user_er").(*middleware.UserERInfo)
		if caller.Role != "admin" && caller.Role != "super_admin" {
			return c.Status(403).JSON(updateUtils.UpdateStatusResponse{
				Success: false, Message: "ไม่มีสิทธิ์เข้าถึง",
			})
		}

		var req updateUtils.UpdateStatusRequest
		if err := c.BodyParser(&req); err != nil || req.UserID == 0 {
			return c.Status(400).JSON(updateUtils.UpdateStatusResponse{
				Success: false, Message: "ข้อมูลไม่ถูกต้อง",
			})
		}

		// ถ้า approve ต้องระบุ role
		if req.Status {
			validRoles := map[string]bool{"user": true, "driver": true, "admin": true}
			if !validRoles[req.Role] {
				return c.Status(400).JSON(updateUtils.UpdateStatusResponse{
					Success: false, Message: "กรุณาระบุ role ให้ถูกต้อง (user / driver / admin)",
				})
			}
		}

		ctx := context.Background()

		info, err := serviceUpdate.GetUserBasicInfo(ctx, db, req.UserID)
		if err != nil {
			return c.Status(404).JSON(updateUtils.UpdateStatusResponse{
				Success: false, Message: err.Error(),
			})
		}

		if err := serviceUpdate.UpdateStatus(ctx, db, req.UserID, req.Status, req.Role); err != nil {
			return c.Status(500).JSON(updateUtils.UpdateStatusResponse{
				Success: false, Message: "อัปเดตสถานะไม่สำเร็จ",
			})
		}

		log.Printf("✅ อัปเดตสถานะ user %s → %v โดย %s", info.FullName, req.Status, caller.Email)

		go notifyUser(info, req.Status)

		msg := "ระงับบัญชีผู้ใช้เรียบร้อย"
		if req.Status {
			msg = "อนุมัติบัญชีผู้ใช้เรียบร้อย"
		}
		return c.Status(200).JSON(updateUtils.UpdateStatusResponse{Success: true, Message: msg})
	}
}

func notifyUser(info *serviceUpdate.UserBasicInfo, approved bool) {
	// MOPH
	if info.CID != "" {
		flexMsg := handlerMophAlert.CreateStatusChangeFlexMessage(info.FullName, approved)
		result := mophAlert.SendAlert(mophAlertUtils.FlexAlertPayload{
			CID:      []string{info.CID},
			Messages: []mophAlertUtils.FlexMessage{flexMsg},
		})
		if result.MessageCode != 200 {
			log.Printf("⚠️ ส่ง MOPH status alert ไม่สำเร็จ: %s", result.Message)
		}
	}

	// Email
	if info.Email == "" {
		return
	}
	var subject, body string
	if approved {
		subject = "✅ บัญชีของคุณได้รับการอนุมัติ"
		body = handlerEmailAlert.CreateApproveEmailHTML(info.FullName)
	} else {
		subject = "⛔ บัญชีของคุณถูกระงับการใช้งาน"
		body = handlerEmailAlert.CreateSuspendEmailHTML(info.FullName)
	}
	if err := emailAlert.SendEmailSMTP(info.Email, subject, body); err != nil {
		log.Printf("⚠️ ส่ง email status ไม่สำเร็จ: %v", err)
	}
}
