package config

import (
	"crypto/tls"
	"crypto/x509"
	"database/sql"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"time"

	"github.com/go-sql-driver/mysql"
	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

var DB *sql.DB

func InitDB() {
	er := godotenv.Load()
	if er != nil {
		log.Fatal("Error loading .env file")
	}

	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")
	dbSSLCA := os.Getenv("DB_SSL_CA")

	rootCertPool := x509.NewCertPool()
	pem, err := ioutil.ReadFile(dbSSLCA)
	if err != nil {
		log.Fatalf("Failed to read CA cert file: %v", err)
	}
	if ok := rootCertPool.AppendCertsFromPEM(pem); !ok {
		log.Fatal("Failed to append CA cert")
	}

	tlsConfig := &tls.Config{
		RootCAs: rootCertPool,
	}

	err = mysql.RegisterTLSConfig("custom", tlsConfig)
	if err != nil {
		log.Fatalf("Failed to register TLS config: %v", err)
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?tls=custom&parseTime=true&timeout=30s&readTimeout=30s&writeTimeout=30s",
		dbUser,
		dbPassword,
		dbHost,
		dbPort,
		dbName,
	)

	DB, err = sql.Open("mysql", dsn)
	if err != nil {
		fmt.Print("Error: ", err)
		panic("Cannot connect to the database")
	}

	DB.SetMaxOpenConns(10)
	DB.SetMaxIdleConns(5)
	DB.SetConnMaxLifetime(3 * time.Minute) // recycle connections before server closes them
	DB.SetConnMaxIdleTime(1 * time.Minute) // drop idle connections quickly

	// Auto-create consultancy_works table if it doesn't exist
	createConsultancyTable := `
	CREATE TABLE IF NOT EXISTS consultancy_works (
		id               BIGINT AUTO_INCREMENT PRIMARY KEY,
		project_title    VARCHAR(255) NOT NULL,
		client_organization VARCHAR(255) NOT NULL,
		work_description TEXT,
		expected_completion_date DATE NULL,
		attachment_url   VARCHAR(500),
		status           VARCHAR(50) NOT NULL DEFAULT 'pending_iqac',
		submitted_by     VARCHAR(255) NOT NULL,
		submitted_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		iqac_assignment  TEXT NULL,
		hod_assignment   TEXT NULL,
		faculty_response TEXT NULL
	)`
	if _, err := DB.Exec(createConsultancyTable); err != nil {
		log.Fatalf("Failed to create consultancy_works table: %v", err)
	}

	// Ensure status column is VARCHAR(50) to support all status values including form_pending.
	// This handles the case where the table was originally created with an ENUM column.
	_, _ = DB.Exec(`ALTER TABLE consultancy_works MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'pending_iqac'`)

	fmt.Print("Successfully connected to the database!!")
}
