package serviceImagesParcelChecked

import (
	"context"
	"strings"

	modelParcel "go-fiber-check-ambu/src/database/models/parcel"

	"github.com/uptrace/bun"
)

func CheckImageAccess(ctx context.Context, db *bun.DB, imagePath string, userID int64) (bool, error) {
	pathParts := strings.Split(imagePath, "/")
	if len(pathParts) < 2 {
		return false, nil
	}
	filename := pathParts[len(pathParts)-1]
	count, err := db.NewSelect().
		Model((*modelParcel.ParcelChecked)(nil)).
		Where("parcel_checked.checked_by = ?", userID).
		Where("parcel_checked.checklist_items::text LIKE ?", "%"+filename+"%").
		Where("parcel_checked.is_active = ?", true).
		Where("parcel_checked.deleted_at IS NULL").
		Count(ctx)
	return count > 0, err
}
