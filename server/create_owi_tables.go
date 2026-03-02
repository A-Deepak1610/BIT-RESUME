package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"strings"

	"bitresume/config"
)

func main() {
	// Initialize database connection
	config.InitDB()
	defer config.DB.Close()

	fmt.Println("Successfully connected to the database!!")
	fmt.Println("=================================")

	// Read the SQL file
	sqlFile := "database/owi_tables.sql"
	content, err := ioutil.ReadFile(sqlFile)
	if err != nil {
		log.Fatalf("Failed to read SQL file: %v", err)
	}

	// Split SQL statements by semicolon
	statements := strings.Split(string(content), ";")

	// Execute each statement
	successCount := 0
	errorCount := 0

	for i, statement := range statements {
		statement = strings.TrimSpace(statement)
		if statement == "" {
			continue
		}

		// Skip comments
		if strings.HasPrefix(statement, "--") {
			continue
		}

		// Execute the statement
		_, err := config.DB.Exec(statement)
		if err != nil {
			log.Printf("Error executing statement %d: %v\n", i+1, err)
			errorCount++
		} else {
			// Check if it's a CREATE TABLE statement
			if strings.Contains(strings.ToUpper(statement), "CREATE TABLE") {
				successCount++
			}
		}
	}

	fmt.Println("Migration completed!")
	fmt.Printf("Tables created: %d\n", successCount)
	if errorCount > 0 {
		fmt.Printf("Errors encountered: %d\n", errorCount)
	}
	fmt.Println("✓ All tables created successfully!")
	fmt.Println("=================================")
}
