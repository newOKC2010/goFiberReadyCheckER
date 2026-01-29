package handlerAdd

import (
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"

	addUtils "go-fiber-check-ambu/src/controller/carChecked/add/utils"
	env "go-fiber-check-ambu/src/loadEnv"
)

func SaveMultipleFiles(files []*multipart.FileHeader, folder string, userID int64) ([]*addUtils.UploadResult, error) {
	results := make([]*addUtils.UploadResult, 0)

	for i, file := range files {
		fullPath, relativePath, err := SaveFileWithIndex(file, folder, userID, i)
		if err != nil {
			return nil, err
		}

		result := &addUtils.UploadResult{
			FullPath:     fullPath,
			RelativePath: relativePath,
		}
		results = append(results, result)
	}

	return results, nil
}

func SaveFileWithIndex(file *multipart.FileHeader, folder string, userID int64, index int) (string, string, error) {
	basePath := env.LoadUploadPath()

	uploadDir := filepath.Join(basePath, "car_checked", folder)
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		return "", "", fmt.Errorf("ไม่สามารถสร้างโฟลเดอร์ได้")
	}

	ext := filepath.Ext(file.Filename)
	timestamp := time.Now().Format("20060102150405")
	filename := fmt.Sprintf("%d_%s_%d%s", userID, timestamp, index, ext)

	fullPath := filepath.Join(uploadDir, filename)
	relativePath := fmt.Sprintf("/car_checked/%s/%s", folder, filename)

	return fullPath, relativePath, nil
}
