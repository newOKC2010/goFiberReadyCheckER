package serviceAddEmergencyChecked

import (
	"context"
	"fmt"

	modelAuth "go-fiber-check-ambu/src/database/models/auth"
	modelEmergency "go-fiber-check-ambu/src/database/models/emergency"

	"github.com/uptrace/bun"
)

func GetEmergencyByID(ctx context.Context, db *bun.DB, emergencyID int64) (*modelEmergency.Emergency, error) {
	em := new(modelEmergency.Emergency)
	err := db.NewSelect().
		Model(em).
		Where("id = ?", emergencyID).
		Where("active = ?", true).
		Where("deleted_at IS NULL").
		Scan(ctx)

	if err != nil {
		return nil, fmt.Errorf("ไม่พบข้อมูลรถฉุกเฉิน ID: %d", emergencyID)
	}

	return em, nil
}

func CheckEmergencyAlreadyCheckedToday(ctx context.Context, db *bun.DB, emergencyID int64) (bool, error) {
	count, err := db.NewSelect().
		Model((*modelEmergency.EmergencyChecked)(nil)).
		Where("emergency_id = ?", emergencyID).
		Where("DATE(checked_date) = CURRENT_DATE").
		Where("is_active = ?", true).
		Where("deleted_at IS NULL").
		Count(ctx)

	return count > 0, err
}

func CreateEmergencyChecked(ctx context.Context, db *bun.DB, emergencyID int64, licensePlate string, checkedBy int64, checklistItems interface{}) (int64, error) {
	ec := &modelEmergency.EmergencyChecked{
		EmergencyID:      emergencyID,
		LicensePlateName: licensePlate,
		CheckedBy:        &checkedBy,
		ChecklistItems:   checklistItems,
		IsActive:         true,
	}

	_, err := db.NewInsert().Model(ec).Exec(ctx)
	if err != nil {
		return 0, fmt.Errorf("บันทึกข้อมูลไม่สำเร็จ: %w", err)
	}

	return ec.ID, nil
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
