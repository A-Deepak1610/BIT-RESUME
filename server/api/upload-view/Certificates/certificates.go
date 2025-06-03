package certificates

import (
	certificatetypes "bitresume/api/upload-view/Certificates/certificate_types"
	"bitresume/config"
	"github.com/gin-gonic/gin"
)

func ReceiveCertificateData(c *gin.Context) {
	certificateType := c.PostForm("certificate_type")
	rollno := "7376242AL153"

	query := `
		INSERT INTO certificates_type (
			rollno,
			certificate_type
		) VALUES (?, ?)
	`

	_, err := config.DB.Exec(query, rollno, certificateType)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to save certificate type to the database"})
		return
	}

	if certificateType == "online-course" {
		certificatetypes.ReceiveDataOnlineCourse(c, rollno)
		return
	}else if certificateType == "hackathon"{
		certificatetypes.ReceiveEventsData(c)
		return
	}else if certificateType == "participation"{
		certificatetypes.ReceiveVoluntreeData(c)
		return
	}

	c.JSON(400, gin.H{"error": "Unsupported certificate type"})
}
