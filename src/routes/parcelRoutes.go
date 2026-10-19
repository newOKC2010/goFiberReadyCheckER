package routes

import (
	mainAddParcel "go-fiber-check-ambu/src/controller/parcel/add"
	mainUpdateParcel "go-fiber-check-ambu/src/controller/parcel/update"
	mainViewsParcel "go-fiber-check-ambu/src/controller/parcel/views"
	mainAddParcelChecked "go-fiber-check-ambu/src/controller/parcelChecked/add"
	deleteParcelChecked "go-fiber-check-ambu/src/controller/parcelChecked/delete"
	updateParcelChecked "go-fiber-check-ambu/src/controller/parcelChecked/update"
	viewsParcelChecked "go-fiber-check-ambu/src/controller/parcelChecked/views"
	imagesParcelChecked "go-fiber-check-ambu/src/controller/parcelChecked/views/images"
	mainAddParcelList "go-fiber-check-ambu/src/controller/parcelList/add"
	mainUpdateParcelList "go-fiber-check-ambu/src/controller/parcelList/update"
	mainViewsParcelList "go-fiber-check-ambu/src/controller/parcelList/views"
	"go-fiber-check-ambu/src/middleware"
	ratelimit "go-fiber-check-ambu/src/middleware/rateLimit"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/uptrace/bun"
)

func SetupParcelRoutes(app fiber.Router, db *bun.DB) {
	// parcel (ทะเบียนพัสดุ)
	p := app.Group("/parcel")
	p.Post("/add", middleware.AuthGuards(db, []string{"admin", "super_admin"}), ratelimit.RateLimitByUsers(10, 1*time.Minute), mainAddParcel.AddParcel(db))
	p.Put("/update", middleware.AuthGuards(db, []string{"admin", "super_admin"}), ratelimit.RateLimitByUsers(10, 1*time.Minute), mainUpdateParcel.UpdateParcel(db))
	p.Get("/views", middleware.AuthGuards(db, nil), ratelimit.RateLimitByUsers(60, 1*time.Minute), mainViewsParcel.ViewsParcels(db))

	// parcel-list (รายการตรวจสอบ)
	pl := app.Group("/parcel-list")
	pl.Post("/add", middleware.AuthGuards(db, []string{"admin", "super_admin"}), ratelimit.RateLimitByUsers(10, 1*time.Minute), mainAddParcelList.AddParcelList(db))
	pl.Put("/update", middleware.AuthGuards(db, []string{"admin", "super_admin"}), ratelimit.RateLimitByUsers(10, 1*time.Minute), mainUpdateParcelList.UpdateParcelList(db))
	pl.Get("/views", middleware.AuthGuards(db, nil), ratelimit.RateLimitByUsers(60, 1*time.Minute), mainViewsParcelList.ViewsParcelLists(db))

	// parcel-checked (บันทึกผลการตรวจ)
	pc := app.Group("/parcel-checked")
	pc.Post("/add", middleware.AuthGuards(db, nil), ratelimit.RateLimitByUsers(30, 1*time.Minute), mainAddParcelChecked.AddParcelChecked(db))
	pc.Put("/update", middleware.AuthGuards(db, nil), ratelimit.RateLimitByUsers(20, 1*time.Minute), updateParcelChecked.UpdateParcelChecked(db))
	pc.Delete("/delete", middleware.AuthGuards(db, []string{"admin", "super_admin"}), ratelimit.RateLimitByUsers(10, 1*time.Minute), deleteParcelChecked.DeleteParcelChecked(db))
	pc.Get("/views", middleware.AuthGuards(db, nil), ratelimit.RateLimitByUsers(60, 1*time.Minute), viewsParcelChecked.ViewParcelChecked(db))
	pc.Get("/view-image/*", middleware.AuthGuards(db, nil), ratelimit.RateLimitByUsers(100, 1*time.Minute), imagesParcelChecked.ServeImage(db))
}
