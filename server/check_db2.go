package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

func checkDatabase() {
	er := godotenv.Load(".env")
	if er != nil {
		log.Fatal("Error loading .env file")
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s",
		os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_NAME"),
	)
	dsn += "?tls=skip-verify"

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	tables := []string{
		"faculty_irp_visit",
		"faculty_industry_projects",
		"faculty_trained_by_industry",
		"faculty_external_vip_visit",
		"faculty_consultancy",
		"industry_advisor",
		"faculty_laboratory_by_industry",
	}

	for _, table := range tables {
		fmt.Printf("--- Table: %s ---\n", table)
		rows, err := db.Query("DESCRIBE " + table)
		if err != nil {
			fmt.Println("Error describing table:", err)
			continue
		}

		hasFacultyID := false
		for rows.Next() {
			var field, typ, null, key, defaultVal, extra sql.NullString
			err := rows.Scan(&field, &typ, &null, &key, &defaultVal, &extra)
			if err != nil {
				log.Fatal(err)
			}
			if strings.Contains(strings.ToLower(field.String), "faculty") {
				fmt.Printf("  %s %s\n", field.String, typ.String)
				if field.String == "faculty_id" {
					hasFacultyID = true
				}
			}
		}
		rows.Close()
		if hasFacultyID {
			fmt.Println("  => HAS faculty_id column")
		} else {
			fmt.Println("  => MISSING faculty_id column!")
		}
	}
}
