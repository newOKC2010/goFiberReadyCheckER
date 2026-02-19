// Package dashboardUtils กำหนด type ทั้งหมดที่ใช้งานใน dashboard
package dashboardUtils

// ---- Response Types (ส่งกลับให้ client) ----

// CarReadiness แสดงสถานะความพร้อมของรถแต่ละคัน (Fleet Readiness)
type CarReadiness struct {
	CarID            int64   `json:"car_id"`
	LicensePlateName string  `json:"license_plate_name"`
	TotalItems       int     `json:"total_items"`
	PassedItems      int     `json:"passed_items"`
	PassPercent      float64 `json:"pass_percent"`
	Status           string  `json:"status"` // "green"=100%, "yellow">=80%, "red"<80%, "unchecked"=ยังไม่ตรวจ
	CheckedRecordID  *int64  `json:"checked_record_id,omitempty"`
}

// FailingItem รายการ checklist ที่ไม่ผ่านบ่อยที่สุด (Top Failing Items)
type FailingItem struct {
	Name        string `json:"name"`
	ChecklistID string `json:"checklist_id"`
	FailCount   int    `json:"fail_count"`
}

// UncheckedCar รถที่ยังไม่ได้ตรวจวันนี้ (Compliance)
type UncheckedCar struct {
	CarID            int64  `json:"car_id"`
	LicensePlateName string `json:"license_plate_name"`
}

// CheckerSummary สรุปจำนวนการตรวจของแต่ละคน (Compliance)
type CheckerSummary struct {
	CheckedBy string `json:"checked_by"`
	Count     int    `json:"count"`
}

// DashboardResponse response หลักของ dashboard
type DashboardResponse struct {
	Success         bool             `json:"success"`
	Message         string           `json:"message"`
	FleetReadiness  []CarReadiness   `json:"fleet_readiness,omitempty"`
	TopFailingItems []FailingItem    `json:"top_failing_items,omitempty"`
	UncheckedCars   []UncheckedCar   `json:"unchecked_cars,omitempty"`
	CheckerSummary  []CheckerSummary `json:"checker_summary,omitempty"`
}

// ---- Internal Query Types (ใช้รับข้อมูลจาก DB) ----

// CarCheckedRow รับข้อมูลจาก table car_checked
type CarCheckedRow struct {
	ID             int64  `bun:"id"`
	CarID          int64  `bun:"car_id"`
	ChecklistItems []byte `bun:"checklist_items"`
}

// ChecklistItemsJSON parse checklist_items jsonb เฉพาะ status
type ChecklistItemsJSON struct {
	Items []ChecklistItemStatus `json:"items"`
}

type ChecklistItemStatus struct {
	Status bool `json:"status"`
}

// FailingRow รับ checklist_items จาก table car_checked
type FailingRow struct {
	ChecklistItems []byte `bun:"checklist_items"`
}

// ChecklistItemFailing parse checklist_items jsonb สำหรับ top failing
type ChecklistItemFailing struct {
	Name        string `json:"name"`
	ChecklistID string `json:"checklist_id"`
	Status      bool   `json:"status"`
}

// CheckerRow รับ checked_by + count จาก query
type CheckerRow struct {
	CheckedBy string `bun:"checked_by"`
	Count     int    `bun:"count"`
}
