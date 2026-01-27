package modelService

import (
	"context"
	modelAuth "go-fiber-check-ambu/src/database/models/auth"
	modelCheckAmbu "go-fiber-check-ambu/src/database/models/checkAmbu"

	"fmt"
	"log"

	"github.com/uptrace/bun"
)

func CreateTables(db *bun.DB) (int, error) {
	ctx := context.Background()
	allModels := append(modelAuth.GetModelsAuth(), modelCheckAmbu.GetModelsCheckAmbu()...)

	var created int
	for _, m := range allModels {
		table := db.NewCreateTable().Model(m).GetTableName()
		exists, err := tableExists(ctx, db, table)
		if err != nil {
			return 0, err
		}
		if exists {
			log.Printf("Table '%s' exists, skipping", table)
			continue
		}
		if _, err := db.NewCreateTable().Model(m).IfNotExists().Exec(ctx); err != nil {
			return 0, fmt.Errorf("create table '%s': %w", table, err)
		}
		log.Printf("Table '%s' created", table)
		created++
	}

	return created, nil
}

// tableExists - ตรวจสอบว่า table มีอยู่แล้วหรือไม่
func tableExists(ctx context.Context, db *bun.DB, name string) (bool, error) {
	return db.NewSelect().
		TableExpr("information_schema.tables").
		Where("table_name = ?", name).
		Exists(ctx)
}
