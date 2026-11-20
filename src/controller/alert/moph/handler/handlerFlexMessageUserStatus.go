package handlerMophAlert

import (
	"fmt"
	"time"

	mophAlertUtils "go-fiber-check-ambu/src/controller/alert/moph/utils"
)

func CreateNewRegisterFlexMessage(fullName string) mophAlertUtils.FlexMessage {
	loc, _ := time.LoadLocation("Asia/Bangkok")
	timeStr := time.Now().In(loc).Format("2/1/2006 15:04:05")

	return mophAlertUtils.FlexMessage{
		Type:    "flex",
		AltText: "มีผู้สมัครเข้าใช้งานระบบใหม่",
		Contents: mophAlertUtils.FlexBubble{
			Type: "bubble",
			Header: &mophAlertUtils.FlexBox{
				Type:   "box",
				Layout: "vertical",
				Contents: []interface{}{
					mophAlertUtils.FlexText{
						Type:   "text",
						Text:   "🔔 แจ้งเตือนการสมัครใช้งาน",
						Weight: "bold",
						Size:   "lg",
						Color:  "#FF6B00",
						Wrap:   true,
					},
				},
			},
			Body: &mophAlertUtils.FlexBox{
				Type:   "box",
				Layout: "vertical",
				Contents: []interface{}{
					mophAlertUtils.FlexText{
						Type:   "text",
						Text:   fmt.Sprintf(`มีผู้สมัครเข้าใช้งานระบบ ชื่อ "%s"`, fullName),
						Wrap:   true,
						Size:   "md",
						Weight: "bold",
					},
					mophAlertUtils.FlexText{
						Type:   "text",
						Text:   "กรุณาตรวจสอบและอนุมัติการเข้าใช้งาน",
						Size:   "sm",
						Color:  "#666666",
						Margin: "md",
					},
					mophAlertUtils.FlexText{
						Type:   "text",
						Text:   fmt.Sprintf("เมื่อ: %s", timeStr),
						Size:   "xs",
						Color:  "#999999",
						Margin: "xs",
					},
				},
			},
		},
	}
}

func CreateStatusChangeFlexMessage(fullName string, approved bool) mophAlertUtils.FlexMessage {
	loc, _ := time.LoadLocation("Asia/Bangkok")
	timeStr := time.Now().In(loc).Format("2/1/2006 15:04:05")

	title := "⛔ บัญชีถูกระงับการใช้งาน"
	body := fmt.Sprintf(`บัญชีของคุณ "%s" ถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ`, fullName)
	color := "#dc3545"

	if approved {
		title = "✅ บัญชีได้รับการอนุมัติ"
		body = fmt.Sprintf(`บัญชีของคุณ "%s" ได้รับการอนุมัติเรียบร้อยแล้ว สามารถเข้าใช้งานระบบได้`, fullName)
		color = "#28a745"
	}

	return mophAlertUtils.FlexMessage{
		Type:    "flex",
		AltText: title,
		Contents: mophAlertUtils.FlexBubble{
			Type: "bubble",
			Header: &mophAlertUtils.FlexBox{
				Type:   "box",
				Layout: "vertical",
				Contents: []interface{}{
					mophAlertUtils.FlexText{
						Type:   "text",
						Text:   title,
						Weight: "bold",
						Size:   "lg",
						Color:  color,
						Wrap:   true,
					},
				},
			},
			Body: &mophAlertUtils.FlexBox{
				Type:   "box",
				Layout: "vertical",
				Contents: []interface{}{
					mophAlertUtils.FlexText{
						Type:   "text",
						Text:   body,
						Wrap:   true,
						Size:   "md",
						Weight: "bold",
					},
					mophAlertUtils.FlexText{
						Type:   "text",
						Text:   fmt.Sprintf("เมื่อ: %s", timeStr),
						Size:   "xs",
						Color:  "#999999",
						Margin: "md",
					},
				},
			},
		},
	}
}
