package serviceAddParcelChecked

import (
	"context"
	"fmt"

	modelAuth "go-fiber-check-ambu/src/database/models/auth"
	modelParcel "go-fiber-check-ambu/src/database/models/parcel"

	"github.com/uptrace/bun"
)

func GetParcelByID(ctx context.Context, db *bun.DB, parcelID int64) (*modelParcel.Parcel, error) {
	p := new(modelParcel.Parcel)
	err := db.NewSelect().Model(p).
		Where("id = ?", parcelID).Where("active = ?", true).Where("deleted_at IS NULL").Scan(ctx)
	if err != nil {
		return nil, fmt.Errorf("ไม่พบข้อมูลพัสดุ ID: %d", parcelID)
	}
	return p, nil
}

func CheckParcelAlreadyCheckedToday(ctx context.Context, db *bun.DB, parcelID int64) (bool, error) {
	count, err := db.NewSelect().
		Model((*modelParcel.ParcelChecked)(nil)).
		Where("parcel_id = ?", parcelID).
		Where("DATE(checked_date) = CURRENT_DATE").
		Where("is_active = ?", true).
		Where("deleted_at IS NULL").
		Count(ctx)
	return count > 0, err
}

func CreateParcelChecked(ctx context.Context, db *bun.DB, parcelID int64, parcelName string, checkedBy int64, checklistItems interface{}) (int64, error) {
	pc := &modelParcel.ParcelChecked{
		ParcelID: parcelID, ParcelName: parcelName,
		CheckedBy: &checkedBy, ChecklistItems: checklistItems, IsActive: true,
	}
	_, err := db.NewInsert().Model(pc).Exec(ctx)
	if err != nil {
		return 0, fmt.Errorf("บันทึกข้อมูลไม่สำเร็จ: %w", err)
	}
	return pc.ID, nil
}

func GetActiveCIDs(ctx context.Context, db *bun.DB) ([]string, error) {
	var users []modelAuth.UserER
	err := db.NewSelect().Model(&users).Column("cid").Where("status = ?", true).Scan(ctx)
	if err != nil {
		return nil, err
	}
	cids := make([]string, len(users))
	for i, u := range users {
		cids[i] = u.CID
	}
	return cids, nil
}

func GetUserFullName(ctx context.Context, db *bun.DB, userID int64) (string, error) {
	var user modelAuth.UserER
	err := db.NewSelect().Model(&user).Column("full_name").Where("id = ?", userID).Scan(ctx)
	if err != nil {
		return "", fmt.Errorf("ไม่พบข้อมูลผู้ใช้")
	}
	return user.FullName, nil
}
