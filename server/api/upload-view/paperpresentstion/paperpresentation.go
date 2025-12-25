package paperpresentstion

import (
	"bitresume/config"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func ReceivePaperPresentationData(c *gin.Context) {
	rollno := c.PostForm("rollno")
	paper_title := c.PostForm("paper_title")
	conference_title := c.PostForm("conference_title")
	location := c.PostForm("location")
	date_of_presentation := c.PostForm("date_of_presentation")
	award := c.PostForm("award")

	pdf, err := c.FormFile("pdf")
	if err != nil {
		c.JSON(500, gin.H{"error": "PDF file is required"})
		return
	}

	savePathPdf := filepath.Join("uploads/paperpresentation/presentation_pdf", pdf.Filename)

	if err := os.MkdirAll("uploads/paperpresentation/presentation_pdf", os.ModePerm); err != nil {
		c.JSON(500, gin.H{"error": "Could not create directory for PDF"})
		return
	}
	if err := c.SaveUploadedFile(pdf, savePathPdf); err != nil {
		c.JSON(500, gin.H{"error": "Could not save PDF file"})
		return
	}

	// Certificate is optional
	savePathCertificate := ""
	certificate, err := c.FormFile("certificate")
	if err == nil {
		savePathCertificate = filepath.Join("uploads/paperpresentation/presentation_certificate", certificate.Filename)

		if err := os.MkdirAll("uploads/paperpresentation/presentation_certificate", os.ModePerm); err != nil {
			c.JSON(500, gin.H{"error": "Could not create directory for certificate"})
			return
		}
		if err := c.SaveUploadedFile(certificate, savePathCertificate); err != nil {
			c.JSON(500, gin.H{"error": "Could not save certificate file"})
			return
		}
	}

	uploadType := "paperpresentation"

	query := `
		insert into paperpresentation 
		(
			upload_type,
			rollno,
			paper_title,
			conference_title,
			location,
			date_of_presentation,
			pdf,
			certificate,
			award,
			approval_status,
			submitted_on
		)
		values (?,?,?,?,?,?,?,?,?,?,CURRENT_DATE)
	`

	_, err = config.DB.Exec(query, uploadType, rollno, paper_title, conference_title, location, date_of_presentation, savePathPdf, savePathCertificate, award, "Pending")

	if err != nil {
		c.JSON(500, gin.H{"error": "Could not save to database", "details": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "Paper presentation uploaded successfully"})

}
