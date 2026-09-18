package handlerViewsEmergencyChecked

import (
	"encoding/json"

	viewsUtils "go-fiber-check-ambu/src/controller/emergencyChecked/views/utils"
)

func FormatResponse(data []viewsUtils.EmergencyCheckedData, role string) ([]viewsUtils.EmergencyCheckedResponse, error) {
	isAdmin := role == "admin" || role == "super_admin"

	response := make([]viewsUtils.EmergencyCheckedResponse, 0)
	for _, item := range data {
		checklistItems := viewsUtils.ChecklistItems{Items: []viewsUtils.ChecklistItem{}}
		if len(item.ChecklistItems) > 0 {
			json.Unmarshal(item.ChecklistItems, &checklistItems)
		}

		checkedBy := ""
		if isAdmin && item.FullName != nil {
			checkedBy = *item.FullName
		}

		response = append(response, viewsUtils.EmergencyCheckedResponse{
			ID:               item.ID,
			LicensePlateName: item.LicensePlateName,
			CheckedDate:      FormatDateThai(item.CheckedDate),
			CheckedBy:        checkedBy,
			ChecklistItems:   checklistItems,
		})
	}

	return response, nil
}
