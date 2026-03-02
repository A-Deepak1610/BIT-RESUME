package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

func migrateDB() {
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

	// 1. Add faculty_id column to faculty_industry_projects
	fmt.Println("Altering faculty_industry_projects...")
	_, err = db.Exec("ALTER TABLE faculty_industry_projects ADD COLUMN faculty_id VARCHAR(100) AFTER id")
	if err != nil {
		fmt.Println("Warning/Error altering faculty_industry_projects:", err)
	} else {
		fmt.Println("Successfully added faculty_id column to faculty_industry_projects")
		// Migrate old records safely
		_, _ = db.Exec("UPDATE faculty_industry_projects SET faculty_id = 'A-Deepak1610' WHERE faculty_id IS NULL OR faculty_id = ''")
	}

	// 2. Add faculty_id column to faculty_external_vip_visit
	fmt.Println("Altering faculty_external_vip_visit...")
	_, err = db.Exec("ALTER TABLE faculty_external_vip_visit ADD COLUMN faculty_id VARCHAR(100) AFTER id")
	if err != nil {
		fmt.Println("Warning/Error altering faculty_external_vip_visit:", err)
	} else {
		fmt.Println("Successfully added faculty_id column to faculty_external_vip_visit")
		// Migrate old records safely
		_, _ = db.Exec("UPDATE faculty_external_vip_visit SET faculty_id = 'A-Deepak1610' WHERE faculty_id IS NULL OR faculty_id = ''")
	}

	// 3. Migrate other tables that had missing IDs where the column already existed
	tables := []string{
		"faculty_irp_visit",
		"faculty_trained_by_industry",
	}
	for _, table := range tables {
		fmt.Printf("Migrating legacy rows in %s...\n", table)
		_, err := db.Exec(fmt.Sprintf("UPDATE %s SET faculty_id = 'A-Deepak1610' WHERE faculty_id IS NULL OR faculty_id = ''", table))
		if err != nil {
			fmt.Printf("Warning updating old rows in %s: %v\n", table, err)
		}
	}

	fmt.Println("Database migration completed!")
}

func migrateDBMain() {
	migrateDB()
}
