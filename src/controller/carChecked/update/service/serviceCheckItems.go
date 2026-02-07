package serviceUpdate

import (
	"context"
	"encoding/json"
	"fmt"
	updateUtils "go-fiber-check-ambu/src/controller/carChecked/update/utils"
	modelCheckAmbu "go-fiber-check-ambu/src/database/models/checkAmbu"
	loadEnv "go-fiber-check-ambu/src/loadEnv"
	"os"
	"path/filepath"

	"github.com/uptrace/bun"
)

func UpdateChecklistItem(ctx context.Context, db *bun.DB, carCheckedID int64, checklistID, note string, status bool, images []string, hasImagesField bool) error {
	var carChecked modelCheckAmbu.CarChecked
	err := db.NewSelect().
		Model(&carChecked).
		Where("id = ?", carCheckedID).
		Scan(ctx)

	if err != nil {
		return fmt.Errorf("ไม่พบข้อมูล")
	}

	var items updateUtils.ChecklistItems
	jsonData, _ := json.Marshal(carChecked.ChecklistItems)
	json.Unmarshal(jsonData, &items)

	found := false
	var oldImages []string
	for i := range items.Items {
		if items.Items[i].ChecklistID == checklistID {
			oldImages = items.Items[i].Images
			items.Items[i].Note = note
			items.Items[i].Status = status
			items.Items[i].Images = images

			found = true
			break
		}
	}

	if !found {
		return fmt.Errorf("ไม่พบรายการ items ที่ต้องการแก้ไข")
	}

	_, err = db.NewUpdate().
		Model(&carChecked).
		Set("checklist_items = ?", items).
		Where("id = ?", carCheckedID).
		Exec(ctx)

	if err != nil {
		return err
	}

	if len(oldImages) > 0 {
		uploadPath := loadEnv.LoadUploadPath()
		for _, oldImage := range oldImages {
			fullPath := filepath.Join(uploadPath, oldImage)
			os.Remove(fullPath)
		}
	}

	return nil
}
