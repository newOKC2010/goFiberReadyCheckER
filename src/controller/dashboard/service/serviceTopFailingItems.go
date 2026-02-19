// serviceTopFailingItems query หา checklist item ที่ status=false บ่อยที่สุด (Top Failing Items)
package serviceDashboard

import (
	"context"
	"encoding/json"
	"sort"

	dashboardUtils "go-fiber-check-ambu/src/controller/dashboard/utils"

	"github.com/uptrace/bun"
)

func GetTopFailingItems(ctx context.Context, db *bun.DB, limit int) ([]dashboardUtils.FailingItem, error) {
	// ดึง checklist_items ทุก record มาวิเคราะห์
	var rows []dashboardUtils.FailingRow
	err := db.NewSelect().
		TableExpr("car_checked").
		Column("checklist_items").
		Where("deleted_at IS NULL").
		Scan(ctx, &rows)
	if err != nil {
		return nil, err
	}

	// นับจำนวนครั้งที่แต่ละ item fail (status=false) สะสมทุก record
	failMap := make(map[string]*dashboardUtils.FailingItem)
	for _, row := range rows {
		var data struct {
			Items []dashboardUtils.ChecklistItemFailing `json:"items"`
		}
		json.Unmarshal(row.ChecklistItems, &data)

		for _, it := range data.Items {
			if !it.Status {
				if _, ok := failMap[it.ChecklistID]; !ok {
					failMap[it.ChecklistID] = &dashboardUtils.FailingItem{
						Name:        it.Name,
						ChecklistID: it.ChecklistID,
					}
				}
				failMap[it.ChecklistID].FailCount++
			}
		}
	}

	// แปลง map → slice แล้วเรียงจากมากไปน้อย
	result := make([]dashboardUtils.FailingItem, 0, len(failMap))
	for _, v := range failMap {
		result = append(result, *v)
	}

	sort.Slice(result, func(i, j int) bool {
		return result[i].FailCount > result[j].FailCount
	})

	// ตัดเหลือแค่ตาม limit ที่กำหนด
	if limit > 0 && len(result) > limit {
		result = result[:limit]
	}

	return result, nil
}
