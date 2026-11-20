package handlerViews

import (
	"encoding/json"

	viewsUtils "go-fiber-check-ambu/src/controller/carChecked/views/utils"
)

func FormatResponse(data []viewsUtils.CarCheckedData, role string) ([]viewsUtils.CarCheckedResponse, error) {
	isAdmin := role == "admin" || role == "super_admin"

	response := make([]viewsUtils.CarCheckedResponse, 0)
	for _, item := range data {
		checklistItems := viewsUtils.ChecklistItems{
			Items: []viewsUtils.ChecklistItem{},
		}

		if len(item.ChecklistItems) > 0 {
			json.Unmarshal(item.ChecklistItems, &checklistItems)
		}

		checkedBy := ""
		checkedByRole := ""
		if isAdmin {
			if item.FullName != nil {
				checkedBy = *item.FullName
			}
			if item.StaffRole != nil {
				checkedByRole = *item.StaffRole
			}
		}

		response = append(response, viewsUtils.CarCheckedResponse{
			ID:               item.ID,
			LicensePlateName: item.LicensePlateName,
			CheckedDate:      FormatDateThai(item.CheckedDate),
			CheckedBy:        checkedBy,
			CheckedByRole:    checkedByRole,
			ChecklistItems:   checklistItems,
		})
	}

	return response, nil
}
