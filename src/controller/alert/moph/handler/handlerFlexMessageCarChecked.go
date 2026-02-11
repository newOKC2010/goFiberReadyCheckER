package handlerMophAlert

import (
	"fmt"
	"time"

	mophAlertUtils "go-fiber-check-ambu/src/controller/alert/moph/utils"
	addUtils "go-fiber-check-ambu/src/controller/carChecked/add/utils"
)

func CreateCarCheckedFlexMessage(vehicleName, username, checkedDate string, items []addUtils.ChecklistItem) mophAlertUtils.FlexMessage {
	failedItems := []addUtils.ChecklistItem{}
	for _, item := range items {
		if !item.Status {
			failedItems = append(failedItems, item)
		}
	}

	bodyContents := []interface{}{
		mophAlertUtils.FlexText{
			Type:   "text",
			Text:   fmt.Sprintf(`มีการตรวจสอบรถ "%s" เรียบร้อยแล้ว`, vehicleName),
			Wrap:   true,
			Size:   "md",
			Weight: "bold",
		},
		mophAlertUtils.FlexText{
			Type:   "text",
			Text:   fmt.Sprintf("ผู้ตรวจสอบ: %s", username),
			Size:   "sm",
			Color:  "#666666",
			Margin: "md",
		},
		mophAlertUtils.FlexText{
			Type:   "text",
			Text:   fmt.Sprintf("ณ วันที่เวลา: %s", checkedDate),
			Size:   "sm",
			Color:  "#666666",
			Margin: "xs",
		},
	}

	if len(failedItems) > 0 {
		bodyContents = append(bodyContents, mophAlertUtils.FlexText{
			Type:   "text",
			Text:   fmt.Sprintf("⚠️ หัวข้อไม่ผ่าน (%d รายการ):", len(failedItems)),
			Size:   "sm",
			Color:  "#FF0000",
			Margin: "lg",
			Weight: "bold",
		})

		for i, item := range failedItems {
			bodyContents = append(bodyContents, mophAlertUtils.FlexText{
				Type:   "text",
				Text:   fmt.Sprintf("%d. %s", i+1, item.Name),
				Size:   "xs",
				Color:  "#666666",
				Margin: "xs",
				Wrap:   true,
			})
		}
	} else {
		bodyContents = append(bodyContents, mophAlertUtils.FlexText{
			Type:   "text",
			Text:   "✅ ผ่านครบทุกหัวข้อ",
			Size:   "sm",
			Color:  "#28a745",
			Margin: "lg",
			Weight: "bold",
		})
	}

	formattedFooterTime := time.Now().Format("2/1/2006 15:04:05")

	return mophAlertUtils.FlexMessage{
		Type:    "flex",
		AltText: "แจ้งเตือนการตรวจสอบรถ ambulance",
		Contents: mophAlertUtils.FlexBubble{
			Type: "bubble",
			Header: &mophAlertUtils.FlexBox{
				Type:   "box",
				Layout: "vertical",
				Contents: []interface{}{
					mophAlertUtils.FlexText{
						Type:   "text",
						Text:   "✅ แจ้งเตือนการตรวจสอบรถ ambulance",
						Weight: "bold",
						Size:   "lg",
						Color:  "#FF0000",
						Wrap:   true,
					},
				},
			},
			Body: &mophAlertUtils.FlexBox{
				Type:     "box",
				Layout:   "vertical",
				Contents: bodyContents,
			},
			Footer: &mophAlertUtils.FlexBox{
				Type:   "box",
				Layout: "vertical",
				Contents: []interface{}{
					mophAlertUtils.FlexText{
						Type:  "text",
						Text:  formattedFooterTime,
						Size:  "xs",
						Color: "#999999",
					},
				},
			},
		},
	}
}
