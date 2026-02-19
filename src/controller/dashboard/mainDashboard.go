package dashboard

import (
	serviceDashboard "go-fiber-check-ambu/src/controller/dashboard/service"
	dashboardUtils "go-fiber-check-ambu/src/controller/dashboard/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

// GetDashboard รวบรวมข้อมูล dashboard ทั้งหมดแล้วส่งกลับใน response เดียว
func GetDashboard(db *bun.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		ctx := c.Context()

		// 1. ความพร้อมของรถแต่ละคัน (% ผ่าน checklist วันนี้)
		fleetReadiness, err := serviceDashboard.GetFleetReadiness(ctx, db)
		if err != nil {
			return c.Status(500).JSON(dashboardUtils.DashboardResponse{
				Success: false,
				Message: "fleet readiness error: " + err.Error(),
			})
		}

		// 2. รายการที่ไม่ผ่านบ่อยที่สุด (top 10)
		topFailing, err := serviceDashboard.GetTopFailingItems(ctx, db, 10)
		if err != nil {
			return c.Status(500).JSON(dashboardUtils.DashboardResponse{
				Success: false,
				Message: "top failing items error: " + err.Error(),
			})
		}

		// 3. รถที่ยังไม่ได้ตรวจวันนี้ + ใครตรวจบ้าง
		unchecked, checkerSummary, err := serviceDashboard.GetCompliance(ctx, db)
		if err != nil {
			return c.Status(500).JSON(dashboardUtils.DashboardResponse{
				Success: false,
				Message: "compliance error: " + err.Error(),
			})
		}

		return c.JSON(dashboardUtils.DashboardResponse{
			Success:         true,
			Message:         "สำเร็จ",
			FleetReadiness:  fleetReadiness,
			TopFailingItems: topFailing,
			UncheckedCars:   unchecked,
			CheckerSummary:  checkerSummary,
		})
	}
}
