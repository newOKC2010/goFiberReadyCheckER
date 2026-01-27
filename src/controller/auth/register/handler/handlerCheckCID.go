package handlerRegister

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	loginUtils "go-fiber-check-ambu/src/controller/auth/login/utils"
	loadEnv "go-fiber-check-ambu/src/loadEnv"
)

func CheckCIDWithAPI(cid string) error {
	config := loadEnv.LoadURLCheckCID()

	if config.URL == "" {
		return nil
	}

	url := fmt.Sprintf("%s?cid=%s", config.URL, cid)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return fmt.Errorf("สร้าง request ไม่สำเร็จ: %w", err)
	}

	req.Header.Set(config.Header, config.Token)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("เชื่อมต่อ API ไม่สำเร็จ: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("อ่าน response ไม่สำเร็จ: %w", err)
	}

	var result loginUtils.CheckCIDResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return fmt.Errorf("แปลง response ไม่สำเร็จ: %w", err)
	}

	if !result.Success {
		return fmt.Errorf("เลขบัตรประชาชนไม่ถูกต้องหรือไม่พบในระบบ HOSxp")
	}

	return nil
}
