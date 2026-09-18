package serviceUpdateEmergencyChecked

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	updateUtils "go-fiber-check-ambu/src/controller/emergencyChecked/update/utils"
	modelEmergency "go-fiber-check-ambu/src/database/models/emergency"
	loadEnv "go-fiber-check-ambu/src/loadEnv"

	"github.com/uptrace/bun"
)

func UpdateChecklistItem(ctx context.Context, db *bun.DB, id int64, checklistID, note string, status bool, images []string, hasImagesField bool) error {
	var ec modelEmergency.EmergencyChecked
	if err := db.NewSelect().Model(&ec).Where("id = ?", id).Scan(ctx); err != nil {
		return fmt.Errorf("ไม่พบข้อมูล")
	}

	var items updateUtils.ChecklistItems
	jsonData, _ := json.Marshal(ec.ChecklistItems)
	json.Unmarshal(jsonData, &items)

	found := false
	var oldImages []string
	for i := range items.Items {
		if items.Items[i].ChecklistID == checklistID {
			oldImages = items.Items[i].Images
			items.Items[i].Note = note
			items.Items[i].Status = status
			if !hasImagesField {
				items.Items[i].Images = []string{}
			} else {
				items.Items[i].Images = images
			}
			found = true
			break
		}
	}

	if !found {
		return fmt.Errorf("ไม่พบรายการ items ที่ต้องการแก้ไข")
	}

	_, err := db.NewUpdate().
		Model(&ec).
		Set("checklist_items = ?", items).
		Where("id = ?", id).
		Exec(ctx)

	if err != nil {
		return err
	}

	if len(oldImages) > 0 {
		uploadPath := loadEnv.LoadUploadPath()
		for _, img := range oldImages {
			os.Remove(filepath.Join(uploadPath, img))
		}
	}

	return nil
}
