package loadenv

import (
	"log"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

func LoadDBconnec() string {
	if err := godotenv.Load(); err != nil {
		panic(err)
	}
	return os.Getenv("DB_URL")
}

func LoadPort() string {
	if err := godotenv.Load(); err != nil {
		panic(err)
	}
	return os.Getenv("PORT")
}

func LoadCreateModel() string {
	if err := godotenv.Load(); err != nil {
		panic(err)
	}
	return os.Getenv("CREATE_MODEL")
}

func LoadOTPExpiresIn(minutesOnly ...bool) string {
	if err := godotenv.Load(); err != nil {
		panic(err)
	}
	expiresIn := os.Getenv("OTP_EXPIRES_IN")
	if len(minutesOnly) > 0 && minutesOnly[0] {
		if expiresIn == "" {
			return "5"
		}
		if len(expiresIn) > 0 && expiresIn[len(expiresIn)-1:] == "m" {
			return expiresIn[:len(expiresIn)-1]
		}
	}
	return expiresIn
}

func LoadEmail() Email {
	if err := godotenv.Load(); err != nil {
		panic(err)
	}
	return Email{
		Email:    os.Getenv("EMAIL"),
		Password: os.Getenv("EMAIL_PASSWORD"),
	}
}

func LoadJWT() JWT {
	if err := godotenv.Load(); err != nil {
		panic(err)
	}
	return JWT{
		Secret:   os.Getenv("JWT_SECRET"),
		ExpireIn: os.Getenv("JWT_EXPIRES_IN"),
	}
}

func LoadURLCheckCID() URLCheckCID {
	if err := godotenv.Load(); err != nil {
		panic(err)
	}
	return URLCheckCID{
		URL:    os.Getenv("URL_CHECK_CID"),
		Header: os.Getenv("URL_CHECK_CID_HEADER"),
		Token:  os.Getenv("URL_CHECK_CID_TOKEN"),
	}
}

func LoadMOPHAlert() MOPHAlert {
	if err := godotenv.Load(); err != nil {
		panic(err)
	}
	return MOPHAlert{
		URL:       os.Getenv("MOPH_ALERT_URL"),
		Method:    os.Getenv("MOPH_ALERT_METHOD"),
		ClientID:  os.Getenv("MOPH_ALERT_CLIENT_ID"),
		SecretKey: os.Getenv("MOPH_ALERT_SECRET_KEY"),
	}
}

func LoadCORS() CORS {
	if err := godotenv.Load(); err != nil {
		panic(err)
	}
	credentials, _ := strconv.ParseBool(os.Getenv("CORS_CREDENTIALS"))
	return CORS{
		Origins:     strings.Split(os.Getenv("CORS_ORIGINS"), ","),
		Credentials: credentials,
		Methods:     strings.Split(os.Getenv("CORS_METHODS"), ","),
		Headers:     strings.Split(os.Getenv("CORS_HEADERS"), ","),
	}
}

func LoadUploadPath() string {
	uploadPath := os.Getenv("UPLOAD_PATH")

	// ถ้าไม่กำหนด ใช้ path ภายใน project
	if uploadPath == "" {
		uploadPath = "uploads"
		log.Println("⚠️  UPLOAD_PATH not set, using default: uploads/")
	}

	// สร้าง folder ถ้ายังไม่มี
	if err := os.MkdirAll(uploadPath, os.ModePerm); err != nil {
		log.Printf("⚠️  Cannot create upload path: %s\n", err)
		return "uploads"
	}

	filepath.Abs(uploadPath)

	return uploadPath
}
