package serviceAddParcel

import (
	"context"
	"fmt"

	modelParcel "go-fiber-check-ambu/src/database/models/parcel"

	"github.com/uptrace/bun"
)

func CheckParcelExists(ctx context.Context, db *bun.DB, name string) (bool, error) {
	count, err := db.NewSelect().
		Model((*modelParcel.Parcel)(nil)).
		Where("name = ?", name).
		Where("deleted_at IS NULL").
		Count(ctx)
	return count > 0, err
}

func CreateParcel(ctx context.Context, db *bun.DB, name string) (int64, error) {
	p := &modelParcel.Parcel{Name: name, Active: true}
	_, err := db.NewInsert().Model(p).Exec(ctx)
	if err != nil {
		return 0, fmt.Errorf("เพิ่มข้อมูลพัสดุไม่สำเร็จ")
	}
	return p.ID, nil
}
