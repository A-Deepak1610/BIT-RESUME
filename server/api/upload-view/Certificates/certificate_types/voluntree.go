package certificatetypes

import (
	"bitresume/config"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func ReceiveVoluntreeData(c *gin.Context){
	rollno := c.PostForm("rollno")
	certificate_pdf, err := c.FormFile("certificate_pdf")
	activity_type := c.PostForm("activity_type")
	duration := c.PostForm("duration")
	location := c.PostForm("location")

	if err != nil {
		c.JSON(500 , "could not get the pdf")
		return
	}

	savePathPdf := filepath.Join("uploads/certificates/participation",certificate_pdf.Filename)

	if err := os.MkdirAll("uploads/certificates/participation",os.ModePerm); err != nil {
		c.JSON(500, "could not find the file directory")
		return
	}

	if err := c.SaveUploadedFile(certificate_pdf,savePathPdf); err!= nil {
		c.JSON(500, "Could not save the file")
		return
	}

	query := `
		insert into certificates_voluntree
		(
			rollno,
			activity_type,
			duration,
			certificate_pdf,
			location,
			faculty_name,
			faculty_id,
			faculty_reamrks,
			stats,
			submission_date
		) values (?,?,?,?,?,?,?,?,?, current_date)
	`

	_,err = config.DB.Exec(query,rollno,activity_type,duration,savePathPdf,location,"","","","Pending")

	if err != nil {
		c.JSON(500, "Could not insert into db")
		return
	}

	c.JSON(200, "Success")
}