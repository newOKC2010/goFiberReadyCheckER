package middleware

import "github.com/golang-jwt/jwt/v5"

type UserERInfo struct {
	ID     int64  `db:"id" json:"user_er_id"`
	Email  string `db:"email" json:"email"`
	Role   string `db:"role" json:"role"`
	Status bool   `db:"status" json:"-"`
}

type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	User    *UserERInfo `json:"user"`
}

type JWTdecode struct {
	UserERID int64  `json:"user_er_id"`
	Email    string `json:"email"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}
