package handlerLogin

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	loginUtils "go-fiber-check-ambu/src/controller/auth/login/utils"
	loadEnv "go-fiber-check-ambu/src/loadEnv"
)

func CheckCIDWithAPI(cid string) (bool, error) {
	config := loadEnv.LoadURLCheckCID()

	url := fmt.Sprintf("%s?cid=%s", config.URL, cid)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return false, err
	}

	req.Header.Set(config.Header, config.Token)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return false, err
	}

	var result loginUtils.CheckCIDResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return false, err
	}

	if !result.Success {
		return false, fmt.Errorf("%s", result.Message)
	}

	return true, nil
}
