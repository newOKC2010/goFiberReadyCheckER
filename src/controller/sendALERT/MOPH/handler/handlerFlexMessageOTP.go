package handlerMophAlert

import (
	"fmt"
	"time"

	mophAlertUtils "go-fiber-check-ambu/src/controller/sendALERT/MOPH/utils"
)

// CreateOTPFlexMessage - สร้าง Flex Message สำหรับส่ง OTP
func CreateOTPFlexMessage(otpCode, fullName string) mophAlertUtils.FlexMessage {
	currentTime := time.Now().Format("15:04:05")
	return mophAlertUtils.FlexMessage{
		Type:    "flex",
		AltText: "รหัส OTP สำหรับเข้าใช้งานระบบตรวจสอบรถพยาบาล",
		Contents: mophAlertUtils.FlexBubble{
			Type: "bubble",
			Header: &mophAlertUtils.FlexBox{
				Type:   "box",
				Layout: "vertical",
				Contents: []interface{}{
					mophAlertUtils.FlexText{
						Type:   "text",
						Text:   "� ระบบตรวจสอบรถพยาบาล",
						Weight: "bold",
						Size:   "md",
						Color:  "#dc3545",
					},
				},
			},
			Body: &mophAlertUtils.FlexBox{
				Type:    "box",
				Layout:  "vertical",
				Spacing: "md",
				Contents: []interface{}{
					mophAlertUtils.FlexText{
						Type:  "text",
						Text:  fmt.Sprintf("สวัสดี คุณ%s", fullName),
						Size:  "sm",
						Color: "#555555",
						Wrap:  true,
					},
					mophAlertUtils.FlexText{
						Type:   "text",
						Text:   "รหัส OTP ของคุณคือ:",
						Size:   "xs",
						Color:  "#888888",
						Margin: "md",
					},
					mophAlertUtils.FlexBox{
						Type:   "box",
						Layout: "vertical",
						Margin: "lg",
						Contents: []interface{}{
							mophAlertUtils.FlexText{
								Type:   "text",
								Text:   otpCode,
								Weight: "bold",
								Size:   "xxl",
								Color:  "#dc3545",
							},
						},
					},
					mophAlertUtils.FlexText{
						Type:   "text",
						Text:   fmt.Sprintf("⏱️ รหัสนี้มีอายุ 2 นาที\n🕐 ส่งเมื่อ: %s", currentTime),
						Size:   "xs",
						Color:  "#FF5551",
						Margin: "md",
						Wrap:   true,
					},
				},
			},
			Footer: &mophAlertUtils.FlexBox{
				Type:   "box",
				Layout: "vertical",
				Contents: []interface{}{
					mophAlertUtils.FlexText{
						Type:  "text",
						Text:  "⚠️ กรุณาอย่าแชร์รหัสนี้กับผู้อื่น",
						Size:  "xxs",
						Color: "#888888",
						Wrap:  true,
					},
				},
			},
		},
	}
}
