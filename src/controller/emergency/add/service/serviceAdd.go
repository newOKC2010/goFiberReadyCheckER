package serviceAddEmergency

import (
	"context"
	"fmt"
	"strings"

	modelEmergency "go-fiber-check-ambu/src/database/models/emergency"

	"github.com/uptrace/bun"
)

func CheckEmergencyExists(ctx context.Context, db *bun.DB, licensePlateName string) (bool, error) {
	count, err := db.NewSelect().
		Model((*modelEmergency.Emergency)(nil)).
		Where("license_plate_name = ?", licensePlateName).
		Where("deleted_at IS NULL").
		Count(ctx)

	return count > 0, err
}

func CreateEmergency(ctx context.Context, db *bun.DB, licensePlateName, emergencyType string) (int64, error) {
	em := &modelEmergency.Emergency{
		LicensePlateName: licensePlateName,
		Type:             strings.ToUpper(emergencyType),
		Active:           true,
	}

	_, err := db.NewInsert().Model(em).Exec(ctx)
	if err != nil {
		return 0, fmt.Errorf("เพิ่มข้อมูลรถฉุกเฉินไม่สำเร็จ")
	}

	return em.ID, nil
}
