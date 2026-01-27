package loginMain

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"

	handlerLogin "go-fiber-check-ambu/src/controller/auth/login/handler"
	serviceLogin "go-fiber-check-ambu/src/controller/auth/login/service"
	loginUtils "go-fiber-check-ambu/src/controller/auth/login/utils"
)

func VerifyOTP(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var body map[string]interface{}
		if err := c.BodyParser(&body); err != nil {
			return c.Status(400).JSON(loginUtils.Response{
				Success: false,
				Message: "ข้อมูลไม่ถูกต้อง",
			})
		}

		email, otp, errMsg := handlerLogin.ValidateVerifyOTP(body)
		if errMsg != "" {
			return c.Status(400).JSON(loginUtils.Response{
				Success: false,
				Message: errMsg,
			})
		}

		user, valid := serviceLogin.VerifyOTP(db, email, otp)
		if !valid {
			return c.Status(401).JSON(loginUtils.Response{
				Success: false,
				Message: "รหัส OTP ไม่ถูกต้องหรือหมดอายุ",
			})
		}

		if !user.Status {
			return c.Status(403).JSON(loginUtils.Response{
				Success: false,
				Message: "บัญชีผู้ใช้ถูกระงับ กรุณาติดต่อผู้ดูแลระบบ",
			})
		}
		cidValid, err := handlerLogin.CheckCIDWithAPI(user.CID)
		if err != nil {
			log.Printf("❌ Check CID API: %v", err)
			return c.Status(403).JSON(loginUtils.Response{
				Success: false,
				Message: "ไม่สามารถยืนยันตัวตนได้ กรุณาติดต่อผู้ดูแลระบบ",
			})
		}

		if !cidValid {
			return c.Status(403).JSON(loginUtils.Response{
				Success: false,
				Message: "ไม่สามารถยืนยันตัวตนได้",
			})
		}

		token, err := handlerLogin.GenerateJWT(user.ID, user.Email, string(user.Role))
		if err != nil {
			log.Printf("❌ Generate JWT: %v", err)
			return c.Status(500).JSON(loginUtils.Response{
				Success: false,
				Message: "ระบบขัดข้อง กรุณาลองใหม่",
			})
		}

		if err := serviceLogin.SaveTokenToDB(db, user.ID, token); err != nil {
			log.Printf("❌ Save Token: %v", err)
		}

		userInfo := &loginUtils.UserERInfo{
			ID:    user.ID,
			Email: user.Email,
			Role:  string(user.Role),
		}

		return c.JSON(loginUtils.VerifyResponse{
			Success:  true,
			Message:  "เข้าสู่ระบบสำเร็จ",
			Token:    token,
			UserInfo: userInfo,
		})
	}
}
