package handlerUpdateEmergencyChecked

import (
	"fmt"
	"mime/multipart"

	addHandler "go-fiber-check-ambu/src/controller/emergencyChecked/add/handler"

	"github.com/gofiber/fiber/v2"
)

func ValidateRequest(emergencyCheckedID int64, checklistID string) error {
	if emergencyCheckedID <= 0 {
		return fmt.Errorf("emergency_checked_id ไม่ถูกต้อง")
	}
	if checklistID == "" {
		return fmt.Errorf("checklist_id ต้องไม่ว่าง")
	}
	return nil
}

func ProcessUpdateImages(c *fiber.Ctx, form *multipart.Form, checklistID string, userID int64) ([]string, bool, error) {
	fieldName := "images_" + checklistID
	files := form.File[fieldName]

	_, hasField := form.File[fieldName]
	if !hasField {
		for key := range form.File {
			if len(key) > 7 && key[:7] == "images_" {
				return nil, false, fmt.Errorf("ต้องส่ง images_%s ให้ตรงกับ checklist_id ที่ส่งมา", checklistID)
			}
		}
		return nil, false, nil
	}

	if len(files) == 0 || (len(files) == 1 && files[0].Size == 0) {
		return []string{}, true, nil
	}

	var validFiles []*multipart.FileHeader
	for _, file := range files {
		if file.Size > 0 {
			validFiles = append(validFiles, file)
		}
	}

	if len(validFiles) == 0 {
		return []string{}, true, nil
	}

	folder := "images_" + checklistID
	results, err := addHandler.SaveMultipleFiles(validFiles, folder, userID)
	if err != nil {
		return nil, true, err
	}

	for i, file := range validFiles {
		if err := c.SaveFile(file, results[i].FullPath); err != nil {
			return nil, true, err
		}
	}

	images := make([]string, len(results))
	for i, result := range results {
		images[i] = result.RelativePath
	}

	return images, true, nil
}
