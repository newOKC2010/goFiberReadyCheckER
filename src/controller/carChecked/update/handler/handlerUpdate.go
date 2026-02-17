package handlerUpdate

import (
	"fmt"
	"mime/multipart"

	addHandler "go-fiber-check-ambu/src/controller/carChecked/add/handler"

	"github.com/gofiber/fiber/v2"
)

func ValidateRequest(carCheckedID int64, checklistID string) error {
	if carCheckedID <= 0 {
		return fmt.Errorf("car_checked_id ไม่ถูกต้อง")
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

	// ถ้าไม่มี files หรือ file แรกเป็น empty file (size = 0) → ลบรูปทั้งหมด
	if len(files) == 0 || (len(files) == 1 && files[0].Size == 0) {
		return []string{}, true, nil
	}

	// กรอง empty files ออก
	var validFiles []*multipart.FileHeader
	for _, file := range files {
		if file.Size > 0 {
			validFiles = append(validFiles, file)
		}
	}

	// ถ้าไม่มี valid files เลย → ลบรูปทั้งหมด
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
