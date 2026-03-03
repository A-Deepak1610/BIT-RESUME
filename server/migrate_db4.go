package main

import (
	"database/sql"
	"fmt"
	"log"

	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

func migrateDB4() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Println("Error loading .env file, continuing with default environment variables")
	}

	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbName := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", dbUser, dbPass, dbHost, dbPort, dbName)
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// 1. Add faculty_id column if it doesn't exist
	alterQueries := []string{
		"ALTER TABLE faculty_consultancy ADD COLUMN faculty_id VARCHAR(255) AFTER id;",
	}

	for _, query := range alterQueries {
		_, err := db.Exec(query)
		if err != nil {
			fmt.Printf("Note: Column might already exist or error occurred: %v\n", err)
		} else {
			fmt.Println("Successfully added faculty_id column")
		}
	}

	// 2. Set the faculty_id for any existing rows to the default user's roll number to prevent data loss
	updateQuery := "UPDATE faculty_consultancy SET faculty_id = 'A-Deepak1610' WHERE faculty_id IS NULL OR faculty_id = '';"
	res, err := db.Exec(updateQuery)
	if err != nil {
		fmt.Printf("Failed to update existing rows: %v\n", err)
	} else {
		rowsAffected, _ := res.RowsAffected()
		fmt.Printf("Successfully updated %d rows to use A-Deepak1610\n", rowsAffected)
	}
}
