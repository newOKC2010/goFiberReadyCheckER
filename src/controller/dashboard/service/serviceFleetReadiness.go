// serviceFleetReadiness คำนวณ % ผ่าน checklist ของแต่ละคันวันนี้ และกำหนดสีสถานะ (Fleet Readiness)
package serviceDashboard

import (
	"context"
	"encoding/json"
	"math"

	dashboardUtils "go-fiber-check-ambu/src/controller/dashboard/utils"
	modelCheckAmbu "go-fiber-check-ambu/src/database/models/checkAmbu"

	"github.com/uptrace/bun"
)

func GetFleetReadiness(ctx context.Context, db *bun.DB) ([]dashboardUtils.CarReadiness, error) {
	// ดึงรถทุกคันที่ active
	var cars []modelCheckAmbu.Car
	err := db.NewSelect().
		Model(&cars).
		Where("active = true AND deleted_at IS NULL").
		Order("id ASC").
		Scan(ctx)
	if err != nil {
		return nil, err
	}

	// ดึงรายการตรวจของวันนี้ทั้งหมด
	var todayChecked []dashboardUtils.CarCheckedRow
	err = db.NewSelect().
		TableExpr("car_checked").
		Column("id", "car_id", "checklist_items").
		Where("checked_date = CURRENT_DATE AND deleted_at IS NULL").
		Scan(ctx, &todayChecked)
	if err != nil {
		return nil, err
	}

	// ทำ map car_id → ข้อมูลการตรวจ เพื่อ lookup ได้เร็ว
	checkedMap := make(map[int64]dashboardUtils.CarCheckedRow)
	for _, row := range todayChecked {
		checkedMap[row.CarID] = row
	}

	// วนรถทุกคัน แล้วคำนวณ % ผ่าน
	result := make([]dashboardUtils.CarReadiness, 0, len(cars))
	for _, car := range cars {
		readiness := dashboardUtils.CarReadiness{
			CarID:            car.ID,
			LicensePlateName: car.LicensePlateName,
			Status:           "unchecked", // default: ยังไม่ตรวจ
		}

		if row, ok := checkedMap[car.ID]; ok {
			id := row.ID
			readiness.CheckedRecordID = &id

			// แปลง jsonb → struct แล้วนับ passed/total
			var items dashboardUtils.ChecklistItemsJSON
			json.Unmarshal(row.ChecklistItems, &items)

			total := len(items.Items)
			passed := 0
			for _, it := range items.Items {
				if it.Status {
					passed++
				}
			}

			readiness.TotalItems = total
			readiness.PassedItems = passed

			// กำหนดสีสถานะตาม %
			if total > 0 {
				pct := math.Round(float64(passed)/float64(total)*100*100) / 100
				readiness.PassPercent = pct
				switch {
				case pct == 100:
					readiness.Status = "green"
				case pct >= 80:
					readiness.Status = "yellow"
				default:
					readiness.Status = "red"
				}
			}
		}

		result = append(result, readiness)
	}

	return result, nil
}
