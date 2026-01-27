package database

import (
	"errors"
	"fmt"
	"log"
	"os"

	modelService "go-fiber-check-ambu/src/database/models"
	loadenv "go-fiber-check-ambu/src/loadEnv"
)

func validateAndGetDBURL() (string, error) {
	envValue := os.Getenv("SELECT_START_DB")
	if envValue == "" {
		return "", errors.New("SELECT_START_DB is not set")
	}

	var dbURL string
	switch envValue {
	case "DEV":
		dbURL = os.Getenv("DB_URL_DEV")
	case "PROD":
		dbURL = os.Getenv("DB_URL_PROD")
	default:
		return "", fmt.Errorf("invalid SELECT_START_DB value: %s (must be DEV or PROD)", envValue)
	}

	if dbURL == "" {
		return "", fmt.Errorf("DB_URL_%s is not set", envValue)
	}

	return dbURL, nil
}

func HandleModelCreation() {
	if Db == nil {
		log.Fatal("Database connection is not initialized")
	}
	// ตรวจสอบว่ามีการกำหนดค่า CREATE_MODEL หรือไม่
	createModel := loadenv.LoadCreateModel()
	if createModel == "" {
		log.Fatal("CREATE_MODEL is not set (must be 'true' or 'false')")
	}
	// ตรวจสอบว่าค่าที่กำหนดให้เป็น true หรือ false
	if createModel != "true" && createModel != "false" {
		log.Fatalf("Invalid CREATE_MODEL value: '%s' (must be 'true' or 'false')", createModel)
	}
	// ถ้ากำหนดให้เป็น false ไม่สร้าง model
	if createModel == "false" {
		log.Println("Model creation skipped (CREATE_MODEL=false)")
		return
	}

	log.Println("Creating models...")
	createdCount, err := modelService.CreateTables(Db)
	if err != nil {
		log.Fatalf("Failed to create models: %v", err)
	}

	if createdCount > 0 {
		log.Printf("Models created successfully (%d new table(s))", createdCount)
	}
}
