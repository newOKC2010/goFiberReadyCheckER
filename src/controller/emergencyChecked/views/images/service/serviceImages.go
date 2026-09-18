package serviceImagesEmergencyChecked

import (
	"context"
	"strings"

	modelEmergency "go-fiber-check-ambu/src/database/models/emergency"

	"github.com/uptrace/bun"
)

func CheckImageAccess(ctx context.Context, db *bun.DB, imagePath string, userID int64) (bool, error) {
	pathParts := strings.Split(imagePath, "/")
	if len(pathParts) < 2 {
		return false, nil
	}

	filename := pathParts[len(pathParts)-1]
	searchPattern := "%" + filename + "%"

	count, err := db.NewSelect().
		Model((*modelEmergency.EmergencyChecked)(nil)).
		Where("emergency_checked.checked_by = ?", userID).
		Where("emergency_checked.checklist_items::text LIKE ?", searchPattern).
		Where("emergency_checked.is_active = ?", true).
		Where("emergency_checked.deleted_at IS NULL").
		Count(ctx)

	return count > 0, err
}
