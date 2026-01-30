package handlerViews

import (
	"fmt"
	"strings"
	"time"
)

var thaiMonths = map[time.Month]string{
	time.January:   "มกราคม",
	time.February:  "กุมภาพันธ์",
	time.March:     "มีนาคม",
	time.April:     "เมษายน",
	time.May:       "พฤษภาคม",
	time.June:      "มิถุนายน",
	time.July:      "กรกฎาคม",
	time.August:    "สิงหาคม",
	time.September: "กันยายน",
	time.October:   "ตุลาคม",
	time.November:  "พฤศจิกายน",
	time.December:  "ธันวาคม",
}

func FormatDateThai(dateStr string) string {
	if dateStr == "" {
		return ""
	}

	dateStr = strings.TrimSpace(dateStr)

	var date time.Time
	var err error

	formats := []string{
		time.RFC3339,
		"2006-01-02T15:04:05Z",
		"2006-01-02",
	}

	for _, format := range formats {
		date, err = time.Parse(format, dateStr)
		if err == nil {
			break
		}
	}

	if err != nil {
		return dateStr
	}

	day := date.Day()
	month := thaiMonths[date.Month()]
	year := date.Year() + 543

	return fmt.Sprintf("%d %s %d", day, month, year)
}
