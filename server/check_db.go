package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

func checkDB() {
	er := godotenv.Load(".env")
	if er != nil {
		log.Fatal("Error loading .env file")
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s",
		os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_NAME"),
	)
	// For TiDB we might not need TLS in this quick check, or if we do we can skip verify or just see if it connects
	dsn += "?tls=skip-verify"

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	rows, err := db.Query("DESCRIBE faculty_coe")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var field, typ, null, key, defaultVal, extra sql.NullString
		err := rows.Scan(&field, &typ, &null, &key, &defaultVal, &extra)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Printf("%s %s\n", field.String, typ.String)
	}
}
