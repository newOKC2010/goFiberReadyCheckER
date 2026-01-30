package serviceImages

import (
	"context"
	"strings"

	modelCheckAmbu "go-fiber-check-ambu/src/database/models/checkAmbu"

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
		Model((*modelCheckAmbu.CarChecked)(nil)).
		Where("car_checked.checked_by = ?", userID).
		Where("car_checked.checklist_items::text LIKE ?", searchPattern).
		Where("car_checked.is_active = ?", true).
		Where("car_checked.deleted_at IS NULL").
		Count(ctx)

	if err != nil {
		return false, err
	}

	return count > 0, nil
}
