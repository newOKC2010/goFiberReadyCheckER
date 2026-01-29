package handlerAdd

import (
	"mime/multipart"

	addUtils "go-fiber-check-ambu/src/controller/carChecked/add/utils"
	"github.com/gofiber/fiber/v2"
)

func ProcessFilesAndUpdateImages(c *fiber.Ctx, form *multipart.Form, checklistItems *addUtils.ChecklistItems, userID int64) error {
	for key, files := range form.File {
		if len(files) == 0 {
			continue
		}

		results, err := SaveMultipleFiles(files, key, userID)
		if err != nil {
			return err
		}

		for i, file := range files {
			if err := c.SaveFile(file, results[i].FullPath); err != nil {
				return err
			}
		}

		for i := range checklistItems.Items {
			if "images_"+checklistItems.Items[i].ChecklistID == key {
				checklistItems.Items[i].Images = make([]string, len(results))
				for j, result := range results {
					checklistItems.Items[i].Images[j] = result.RelativePath
				}
				break
			}
		}
	}

	return nil
}
