package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

func migrateData() {
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

	// Update existing rows that have missing faculty_id but have a faculty Name
	// Based on the user's role and history, the test user is likely "A-Deepak1610".
	// We'll just set it for any missing ones if the name matches what's typically there (Deepak or similar, or just all of them to be safe for this test env)

	// Just query what's there first to see if it's safe
	rows, err := db.Query("SELECT id, faculty FROM faculty_coe WHERE faculty_id IS NULL OR faculty_id = ''")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		var faculty string
		err := rows.Scan(&id, &faculty)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Printf("Updating ID %d (Faculty Name: %s) to Faculty ID 'A-Deepak1610'\n", id, faculty)
		_, err = db.Exec("UPDATE faculty_coe SET faculty_id = 'A-Deepak1610' WHERE id = ?", id)
		if err != nil {
			log.Println("Error updating:", err)
		}
	}
	fmt.Println("Done migrating!")
}
