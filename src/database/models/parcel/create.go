package modelParcel

import (
	"time"

	"github.com/uptrace/bun"
)

type Parcel struct {
	bun.BaseModel `bun:"table:parcel"`

	ID        int64      `bun:"id,pk,autoincrement"`
	Name      string     `bun:"name,notnull"`
	Active    bool       `bun:"active,default:true"`
	DeletedAt *time.Time `bun:"deleted_at"`
	CreatedAt time.Time  `bun:"created_at,nullzero,notnull,default:current_timestamp"`
	UpdatedAt time.Time  `bun:"updated_at,nullzero,notnull,default:current_timestamp"`
}

type ParcelList struct {
	bun.BaseModel `bun:"table:parcel_list"`

	ID          int64      `bun:"id,pk,autoincrement"`
	Name        string     `bun:"name,notnull"`
	Description *string    `bun:"description"`
	ItemType    string     `bun:"item_type,notnull,default:'boolean'"`
	TrueLabel   string     `bun:"true_label,notnull,default:'มี'"`
	FalseLabel  string     `bun:"false_label,notnull,default:'ไม่มี'"`
	IsActive    bool       `bun:"is_active,default:true"`
	DeletedAt   *time.Time `bun:"deleted_at"`
	CreatedAt   time.Time  `bun:"created_at,nullzero,notnull,default:current_timestamp"`
	UpdatedAt   time.Time  `bun:"updated_at,nullzero,notnull,default:current_timestamp"`
}

type ParcelChecked struct {
	bun.BaseModel `bun:"table:parcel_checked"`

	ID             int64       `bun:"id,pk,autoincrement"`
	ParcelID       int64       `bun:"parcel_id,notnull"`
	ParcelName     string      `bun:"parcel_name,notnull"`
	CheckedDate    *time.Time  `bun:"checked_date,type:date,default:current_date"`
	CheckedBy      *int64      `bun:"checked_by"`
	ChecklistItems interface{} `bun:"checklist_items,type:jsonb,notnull"`
	IsActive       bool        `bun:"is_active,default:true"`
	DeletedAt      *time.Time  `bun:"deleted_at"`
	CreatedAt      time.Time   `bun:"created_at,nullzero,notnull,default:current_timestamp"`
	UpdatedAt      time.Time   `bun:"updated_at,nullzero,notnull,default:current_timestamp"`

	Parcel *Parcel `bun:"rel:belongs-to,join:parcel_id=id"`
}

func GetModelsParcel() []interface{} {
	return []interface{}{
		(*Parcel)(nil),
		(*ParcelList)(nil),
		(*ParcelChecked)(nil),
	}
}
