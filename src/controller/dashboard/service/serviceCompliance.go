// serviceCompliance ตรวจสอบว่ารถคันไหนยังไม่ได้ตรวจวันนี้ และสรุปว่าใครเป็นคนตรวจ (Compliance)
package serviceDashboard

import (
	"context"

	dashboardUtils "go-fiber-check-ambu/src/controller/dashboard/utils"
	modelCheckAmbu "go-fiber-check-ambu/src/database/models/checkAmbu"

	"github.com/uptrace/bun"
)

func GetCompliance(ctx context.Context, db *bun.DB) ([]dashboardUtils.UncheckedCar, []dashboardUtils.CheckerSummary, error) {
	// ดึงรถทุกคันที่ active
	var cars []modelCheckAmbu.Car
	err := db.NewSelect().
		Model(&cars).
		Where("active = true AND deleted_at IS NULL").
		Scan(ctx)
	if err != nil {
		return nil, nil, err
	}

	// ดึง car_id ที่มีการตรวจแล้ววันนี้ (distinct)
	var checkedCarIDs []int64
	err = db.NewSelect().
		TableExpr("car_checked").
		ColumnExpr("DISTINCT car_id").
		Where("checked_date = CURRENT_DATE AND deleted_at IS NULL").
		Scan(ctx, &checkedCarIDs)
	if err != nil {
		return nil, nil, err
	}

	// ทำ set เพื่อเช็คว่ารถคันไหนตรวจแล้ว
	checkedSet := make(map[int64]bool)
	for _, id := range checkedCarIDs {
		checkedSet[id] = true
	}

	// หารถที่ยังไม่ได้ตรวจวันนี้
	unchecked := make([]dashboardUtils.UncheckedCar, 0)
	for _, car := range cars {
		if !checkedSet[car.ID] {
			unchecked = append(unchecked, dashboardUtils.UncheckedCar{
				CarID:            car.ID,
				LicensePlateName: car.LicensePlateName,
			})
		}
	}

	// สรุปว่าใครตรวจบ้าง และตรวจไปกี่คัน (วันนี้)
	var checkers []dashboardUtils.CheckerRow
	err = db.NewSelect().
		TableExpr("car_checked cc").
		ColumnExpr("COALESCE(u.full_name, 'ไม่ระบุ') AS checked_by, COUNT(cc.id)::int AS count").
		Join("LEFT JOIN user_er u ON u.id = cc.checked_by").
		Where("cc.checked_date = CURRENT_DATE AND cc.deleted_at IS NULL").
		GroupExpr("u.full_name").
		OrderExpr("count DESC").
		Scan(ctx, &checkers)
	if err != nil {
		return nil, nil, err
	}

	summary := make([]dashboardUtils.CheckerSummary, 0, len(checkers))
	for _, c := range checkers {
		summary = append(summary, dashboardUtils.CheckerSummary{
			CheckedBy: c.CheckedBy,
			Count:     c.Count,
		})
	}

	return unchecked, summary, nil
}
