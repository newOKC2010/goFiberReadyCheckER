package handlerAdd

import (
	"encoding/json"

	addUtils "go-fiber-check-ambu/src/controller/carChecked/add/utils"
)

func ParseChecklistItems(checklistJSON string) (*addUtils.ChecklistItems, error) {
	var items addUtils.ChecklistItems
	if err := json.Unmarshal([]byte(checklistJSON), &items); err != nil {
		return nil, err
	}

	for i := range items.Items {
		if items.Items[i].Images == nil {
			items.Items[i].Images = []string{}
		}
	}

	return &items, nil
}
