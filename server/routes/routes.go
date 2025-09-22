package routes
import (
	activitymaster "bitresume/api/ActivityMaster"
	auth "bitresume/api/auth"                     
	achievementgraph "bitresume/api/dashboard/achievement_graph"
	activitygraph "bitresume/api/dashboard/activity_graph"
	headerdetails "bitresume/api/dashboard/header_details"
	dataUploadPs "bitresume/api/dataUploadPs"
	manageactivities "bitresume/api/faculty/ActivityTracker/ManageActivities"
	studentrequests "bitresume/api/faculty/ActivityTracker/StudentRequests/varifications"
	addevents "bitresume/api/faculty/AddEvents"
	studentdata "bitresume/api/faculty/StudentData"
	dashBoardfaculty "bitresume/api/faculty/dashboardfaculty"
	pointshandlers "bitresume/api/pointsHandlers"
	registerevents "bitresume/api/registerEvents"
	"bitresume/api/resume"
	certificates "bitresume/api/upload-view/Certificates"
	Uploadsdelete "bitresume/api/upload-view/delete"
	"bitresume/api/upload-view/internship"
	"bitresume/api/upload-view/paperpresentstion"
	"bitresume/api/upload-view/patents"
	"bitresume/api/upload-view/projects"
	dashboard "bitresume/api/upload-view/upload_view_dashboard"
	"bitresume/api/upload-view/workshops"
	"bitresume/middleware"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	authGroup := r.Group("/api/auth")
	authGroup.GET("/google/login", auth.GoogleLogin)
	authGroup.GET("/google/callback", auth.GoogleCallback)
	studentOnly := r.Group("/api")
	authGroup.GET("/me", auth.Me)
	authGroup.GET("/logout", auth.Logout)
	studentOnly.Use(middleware.AuthorizeRoles("student"))
	{
		studentOnly.POST("/points_logs/ps/levels", pointshandlers.HandlePsLevelStatus)
		studentOnly.POST("/ps/mentor_mentee/", pointshandlers.HandleMentee)
		studentOnly.POST("/mentee/add", pointshandlers.HandleMentee)
		studentOnly.POST("/projects", projects.PostProjects)
		studentOnly.POST("/patents", patents.ReceivePatentsData)
		studentOnly.POST("/internships", internship.ReceiveInternshipData)
		studentOnly.POST("/workshops", workshops.ReceiveWorkshopData)
		studentOnly.GET("/fetch/header_details", headerdetails.FetchDataRank)
		studentOnly.POST("/paperpresentation", paperpresentstion.ReceivePaperPresentationData)
		studentOnly.POST("/certificates/online-course", certificates.ReceiveCertificateData)
		studentOnly.POST("/certificates/events", certificates.ReceiveCertificateData)
		studentOnly.POST("/certificates/participation", certificates.ReceiveCertificateData)
		studentOnly.POST("/addregisterevents", registerevents.HandleRegisterEvents)
		studentOnly.GET("/events/registered", registerevents.GetRegisteredEvents)
		studentOnly.GET("/events/requested_events", registerevents.GetRequestedEvents)
		studentOnly.GET("/events/registered_events", registerevents.GetRegisteredEvents)
		studentOnly.PUT("/events/registered_events/approve_reject", registerevents.HandleRequestEventsApproveReject)
		studentOnly.GET("/checkapplied", addevents.CheckApplied)
		studentOnly.GET("/resume/getprojects", resume.GetProjectsData)
		studentOnly.GET("/resume/getcertificates", resume.GetCertificatesData)
		studentOnly.GET("/activitymaster/getsurveydata", activitymaster.GetSurveys)
		studentOnly.GET("/activitymaster/getsessiondata", activitymaster.GetSessionsByRollNo)
		studentOnly.GET("/uploadview/getuploaddetails", dashboard.UploadViewDashboard)
		studentOnly.GET("/resume/gethackathondata", resume.GetHackathonData)
		studentOnly.GET("/resume/getinternshipdata", resume.GetInternshipData)
		studentOnly.PUT("/header/updateprofile", headerdetails.UpdateProfile)
		studentOnly.GET("/header/getprofile", headerdetails.GetProfileDetails)
		studentOnly.GET("/ps/levels_status", pointshandlers.HandleFetchPsLevels)
		studentOnly.GET("/ps/metorships",dataUploadPs.GetMentorShips)
		studentOnly.GET("/aresofexpertise",resume.GetAreasOfExpertise)
	}
	facultyOnly := r.Group("/api")
	facultyOnly.Use(middleware.AuthorizeRoles("faculty"))
	{
		facultyOnly.GET("/manageactivities", manageactivities.GetActivityData)
		facultyOnly.GET("/manageactivities/approvels/:rollno", manageactivities.HandleActivityApprovals)
		facultyOnly.PUT("/manageactivities/approvels_reject", manageactivities.HandleApproveReject)
		facultyOnly.GET("/dashboard/leardeardborad/:rollno", dashBoardfaculty.Leaderboard)
		facultyOnly.GET("/dashboard/prioritylearners/:rollno", dashBoardfaculty.HandlePriorityLearners)
		facultyOnly.GET("/studentrequests/varifications", studentrequests.GetVerifications)
		facultyOnly.POST("/manageactivities/createActivity", manageactivities.ReceiveActivityData)
		facultyOnly.GET("/manageactivities/receiveActivities", manageactivities.GetActivityData)
		facultyOnly.GET("manageactivities/progressgrpah/:rollno", manageactivities.HandleProgressGraph)
		facultyOnly.POST("/studentrequests/varifications", studentrequests.PostVarification)

	}
	adminOnly := r.Group("/api")
	adminOnly.Use(middleware.AuthorizeRoles("Admin"))
	{
		adminOnly.DELETE("/deleteevents/:id", addevents.DeleteEvent)
		adminOnly.POST("/addevents/create", addevents.AddEvents)
		adminOnly.GET("/events/fetchregisteredteams/:eventcode", registerevents.HandleRegisteredTeams)
		adminOnly.GET("/studentdata/fetchstudentdata", studentdata.HandleStudentData)
		adminOnly.POST("/mentor-mentee-upload",dataUploadPs.UploadMentorMentee)
	}
	r.GET("/api/activitymaster/fetch", addevents.FetchEvents)
	//both student and faculty
	r.GET("/api/studentdata/fetchmentees/:rollno", studentdata.HandleMenteesData)
	r.GET("/api/activity_graph/fetchData/:rollno", activitygraph.FetchActivityGraphData)
	r.GET("/api/achievement_graph/fetchData/:rollno", achievementgraph.HandleFetchAchievementGraph)
	r.GET("/api/achievement_graph/institute_avg/fetchData", achievementgraph.HandleFetchInstituteAvg)
	r.GET("/api/ps/attempts/:rollno", pointshandlers.HandleFetchPsAttempts)
	r.GET("/api/mentor/details/:rollno", pointshandlers.FetchMentorSkillStats)
	r.GET("/api/mentor/institute_avg/fetchData", pointshandlers.FetchSkillWiseAvgMentees)
	r.GET("/api/sem_wise_totaldays", pointshandlers.HandleSemDays)
	r.GET("/api/handlesem", pointshandlers.HandleSem)
	r.PUT("/api/updatesem", pointshandlers.HandleUpdateSem)
	r.DELETE("/api/uploadview/deleteupload",Uploadsdelete.Uploadsdelete)
	r.GET("/api/getpsdata/:rollno",dataUploadPs.GetPsStatus)
	r.POST("/api/bulkupload",dataUploadPs.BulkUploadHandler)
}
