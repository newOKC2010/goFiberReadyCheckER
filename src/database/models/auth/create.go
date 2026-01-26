package modelAuth

import (
	"time"

	"github.com/uptrace/bun"
)

type UserRole string

const (
	RoleUser       UserRole = "user"
	RoleAdmin      UserRole = "admin"
	RoleSuperAdmin UserRole = "super_admin"
)

type UserER struct {
	bun.BaseModel `bun:"table:user_er,alias:u"`

	ID           int64      `bun:"id,pk,autoincrement"`
	CID          string     `bun:"cid,notnull,unique"`
	HashCID      string     `bun:"hash_cid,notnull"`
	Role         UserRole   `bun:"role,notnull,default:'user'"`
	Status       bool       `bun:"status,notnull,default:true"`
	FullName     string     `bun:"full_name,notnull"`
	Email        string     `bun:"email"`
	OtpCode      *string    `bun:"otp_code"`
	OtpExpiresAt *time.Time `bun:"otp_expires_at"`
	CreatedAt    time.Time  `bun:"created_at,nullzero,notnull,default:current_timestamp"`
	UpdatedAt    time.Time  `bun:"updated_at,nullzero,notnull,default:current_timestamp"`
}

type Tokens struct {
	bun.BaseModel `bun:"table:tokens"`

	ID        int64     `bun:"id,pk,autoincrement"`
	UserERID  int64     `bun:"user_er_id,unique,notnull"`
	Token     string    `bun:"token,notnull"`
	ExpiresAt time.Time `bun:"expires_at,notnull"`
	LoginLast time.Time `bun:"login_last,default:current_timestamp"`

	UserER *UserER `bun:"rel:belongs-to,join:user_er_id=id"`
}

func GetModelsAuth() []interface{} {
	return []interface{}{
		(*UserER)(nil),
		(*Tokens)(nil),
	}
}
