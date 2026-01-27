package modelCheckAmbu

import (
	"time"

	"github.com/uptrace/bun"
)

type Car struct {
	bun.BaseModel `bun:"table:car"`

	ID               int64      `bun:"id,pk,autoincrement"`
	LicensePlateName string     `bun:"license_plate_name,notnull"`
	Active           bool       `bun:"active,default:true"`
	DeletedAt        *time.Time `bun:"deleted_at"`
	CreatedAt        time.Time  `bun:"created_at,nullzero,notnull,default:current_timestamp"`
	UpdatedAt        time.Time  `bun:"updated_at,nullzero,notnull,default:current_timestamp"`
}

type Checklist struct {
	bun.BaseModel `bun:"table:checklist"`

	ID          int64      `bun:"id,pk,autoincrement"`
	Name        string     `bun:"name,notnull"`
	Description *string    `bun:"description"`
	IsActive    bool       `bun:"is_active,default:true"`
	DeletedAt   *time.Time `bun:"deleted_at"`
	CreatedAt   time.Time  `bun:"created_at,nullzero,notnull,default:current_timestamp"`
	UpdatedAt   time.Time  `bun:"updated_at,nullzero,notnull,default:current_timestamp"`
}

type CarChecked struct {
	bun.BaseModel `bun:"table:car_checked"`

	ID               int64      `bun:"id,pk,autoincrement"`
	CarID            int64      `bun:"car_id,notnull"`
	LicensePlateName string     `bun:"license_plate_name,notnull"`
	CheckedDate      *time.Time `bun:"checked_date,default:current_date"`
	CheckedBy        *int64     `bun:"checked_by"`
	ChecklistItems   string     `bun:"checklist_items,type:jsonb,notnull"`
	IsActive         bool       `bun:"is_active,default:true"`
	DeletedAt        *time.Time `bun:"deleted_at"`
	CreatedAt        time.Time  `bun:"created_at,nullzero,notnull,default:current_timestamp"`
	UpdatedAt        time.Time  `bun:"updated_at,nullzero,notnull,default:current_timestamp"`

	Car *Car `bun:"rel:belongs-to,join:car_id=id"`
}

func GetModelsCheckAmbu() []interface{} {
	return []interface{}{
		(*Car)(nil),
		(*Checklist)(nil),
		(*CarChecked)(nil),
	}
}
