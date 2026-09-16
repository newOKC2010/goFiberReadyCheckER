package modelEmergency

import (
	"time"

	"github.com/uptrace/bun"
)

type Emergency struct {
	bun.BaseModel `bun:"table:emergency"`

	ID               int64      `bun:"id,pk,autoincrement"`
	LicensePlateName string     `bun:"license_plate_name,notnull"`
	Type             string     `bun:"type,notnull"` // เช่น ALS, BLS, FR
	Active           bool       `bun:"active,default:true"`
	DeletedAt        *time.Time `bun:"deleted_at"`
	CreatedAt        time.Time  `bun:"created_at,nullzero,notnull,default:current_timestamp"`
	UpdatedAt        time.Time  `bun:"updated_at,nullzero,notnull,default:current_timestamp"`
}

type EmergencyList struct {
	bun.BaseModel `bun:"table:emergency_list"`

	ID          int64      `bun:"id,pk,autoincrement"`
	Name        string     `bun:"name,notnull"`
	Description *string    `bun:"description"`
	IsActive    bool       `bun:"is_active,default:true"`
	DeletedAt   *time.Time `bun:"deleted_at"`
	CreatedAt   time.Time  `bun:"created_at,nullzero,notnull,default:current_timestamp"`
	UpdatedAt   time.Time  `bun:"updated_at,nullzero,notnull,default:current_timestamp"`
}

type EmergencyChecked struct {
	bun.BaseModel `bun:"table:emergency_checked"`

	ID               int64       `bun:"id,pk,autoincrement"`
	EmergencyID      int64       `bun:"emergency_id,notnull"`
	LicensePlateName string      `bun:"license_plate_name,notnull"`
	CheckedDate      *time.Time  `bun:"checked_date,type:date,default:current_date"`
	CheckedBy        *int64      `bun:"checked_by"`
	ChecklistItems   interface{} `bun:"checklist_items,type:jsonb,notnull"`
	IsActive         bool        `bun:"is_active,default:true"`
	DeletedAt        *time.Time  `bun:"deleted_at"`
	CreatedAt        time.Time   `bun:"created_at,nullzero,notnull,default:current_timestamp"`
	UpdatedAt        time.Time   `bun:"updated_at,nullzero,notnull,default:current_timestamp"`

	Emergency *Emergency `bun:"rel:belongs-to,join:emergency_id=id"`
}

func GetModelsEmergency() []interface{} {
	return []interface{}{
		(*Emergency)(nil),
		(*EmergencyList)(nil),
		(*EmergencyChecked)(nil),
	}
}
