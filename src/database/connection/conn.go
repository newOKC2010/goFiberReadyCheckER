package database

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"

	loadenv "go-fiber-check-ambu/src/loadEnv"
)

var Db *bun.DB

func ConnectDB() *bun.DB {
	if Db == nil {
		loadenv.LoadDBconnec()

		dbURL, err := validateAndGetDBURL()
		if err != nil {
			log.Fatal(err)
		}

		sqlDB, err := sql.Open("postgres", dbURL)
		if err != nil {
			log.Fatal(err)
		}

		if err = sqlDB.Ping(); err != nil {
			log.Fatal(err)
		}

		Db = bun.NewDB(sqlDB, pgdialect.New())
		log.Println("connect database success")

		HandleModelCreation()
	}
	return Db
}
