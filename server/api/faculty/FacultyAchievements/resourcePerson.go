package facultyAchievements

import (
	"bitresume/config"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
)

func HandleResourcePersonForm(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	taskID := c.PostForm("taskID")
	specialLabsInvolved := c.PostForm("specialLabsInvolved")
	specialLab := c.PostForm("specialLab")
	resourcePersonCategory := c.PostForm("resourcePersonCategory")
	purposeOfInteraction := c.PostForm("purposeOfInteraction")
	nameOfPanel := c.PostForm("nameOfPanel")
	typeOfOrganisation := c.PostForm("typeOfOrganisation")
	visitingDepartmentIndustry := c.PostForm("visitingDepartmentIndustry")
	visitingDepartmentInstitute := c.PostForm("visitingDepartmentInstitute")
	organisationNameAndAddress := c.PostForm("organisationNameAndAddress")
	numberOfDays := c.PostForm("numberOfDays")
	fromDate := c.PostForm("fromDate")
	toDate := c.PostForm("toDate")

	uploadDir := "./uploads/faculty/resource_person"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, os.ModePerm)
	}

	// Handle Document Proof
	docFile, _ := c.FormFile("documentProof")
	var docPath string
	if docFile != nil {
		docFilename := fmt.Sprintf("%v_%d_%s", facultyID, time.Now().Unix(), docFile.Filename)
		docPath = filepath.Join(uploadDir, docFilename)
		if err := c.SaveUploadedFile(docFile, docPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save document"})
			return
		}
	}

	query := `INSERT INTO faculty_resource_person (
		faculty_id, task_id, special_labs_involved, special_lab, resource_person_category,
		purpose_of_interaction, name_of_panel, type_of_organisation,
		visiting_department_industry, visiting_department_institute,
		organisation_name_and_address, number_of_days, from_date, to_date, document_proof
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := config.DB.Exec(query,
		facultyID, taskID, specialLabsInvolved, specialLab, resourcePersonCategory,
		purposeOfInteraction, nameOfPanel, typeOfOrganisation,
		visitingDepartmentIndustry, visitingDepartmentInstitute,
		organisationNameAndAddress, numberOfDays, fromDate, toDate, docPath,
	)

	if err != nil {
		log.Println("Error inserting resource person:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Resource Person submitted successfully"})
}

func FetchResourcePerson(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	query := `SELECT id, task_id, special_labs_involved, special_lab, resource_person_category,
              purpose_of_interaction, name_of_panel, type_of_organisation,
              visiting_department_industry, visiting_department_institute,
              organisation_name_and_address, number_of_days, from_date, to_date,
              document_proof, status, remarks, created_at 
              FROM faculty_resource_person WHERE faculty_id = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var resources []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                                                                                                                            int
			taskID, specialLabs, specialLab, rpCategory, purposeOfInteraction, nameOfPanel, typeOrg, visitDeptIndustry, visitDeptInstitute, orgNameAddr, numDays, fDate, tDate, docProof, status, remarks sql.NullString
			createdAt                                                                                                                                                                                     []uint8
		)

		if err := rows.Scan(
			&id, &taskID, &specialLabs, &specialLab, &rpCategory,
			&purposeOfInteraction, &nameOfPanel, &typeOrg,
			&visitDeptIndustry, &visitDeptInstitute,
			&orgNameAddr, &numDays, &fDate, &tDate, &docProof, &status, &remarks, &createdAt,
		); err != nil {
			log.Println("Error scanning resource person:", err)
			continue
		}

		resources = append(resources, map[string]interface{}{
			"id":                            id,
			"task_id":                       taskID.String,
			"special_labs_involved":         specialLabs.String,
			"special_lab":                   specialLab.String,
			"resource_person_category":      rpCategory.String,
			"purpose_of_interaction":        purposeOfInteraction.String,
			"name_of_panel":                 nameOfPanel.String,
			"type_of_organisation":          typeOrg.String,
			"visiting_department_industry":  visitDeptIndustry.String,
			"visiting_department_institute": visitDeptInstitute.String,
			"organisation_name_and_address": orgNameAddr.String,
			"number_of_days":                numDays.String,
			"from_date":                     fDate.String,
			"to_date":                       tDate.String,
			"document_proof":                docProof.String,
			"status":                        status.String,
			"remarks":                       remarks.String,
			"created_at":                    string(createdAt),
		})
	}

	c.JSON(http.StatusOK, gin.H{"resourcePerson": resources})
}
