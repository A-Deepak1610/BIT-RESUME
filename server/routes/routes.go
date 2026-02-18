package routes

import (
	activitymaster "bitresume/api/ActivityMaster"
	"bitresume/api/admin"
	auth "bitresume/api/auth"
	achievementgraph "bitresume/api/dashboard/achievement_graph"
	activitygraph "bitresume/api/dashboard/activity_graph"
	headerdetails "bitresume/api/dashboard/header_details"
	dataUploadPs "bitresume/api/dataUploadPs"
	manageactivities "bitresume/api/faculty/ActivityTracker/ManageActivities"
	studentrequests "bitresume/api/faculty/ActivityTracker/StudentRequests/varifications"
	addevents "bitresume/api/faculty/AddEvents"
	facultyAchievements "bitresume/api/faculty/FacultyAchievements"
	studentdata "bitresume/api/faculty/StudentData"
	dashBoardfaculty "bitresume/api/faculty/dashboardfaculty"
	"bitresume/api/login"
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
	outsideWorldInteraction "bitresume/api/faculty/OutsideWorldInteraction"
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
		studentOnly.GET("/activitymaster/getsurveydata", activitymaster.GetSurveys)
		studentOnly.GET("/activitymaster/getsessiondata", activitymaster.GetSessionsByRollNo)
		studentOnly.GET("/uploadview/getuploaddetails", dashboard.UploadViewDashboard)
		studentOnly.PUT("/header/updateprofile", headerdetails.UpdateProfile)
	}
	facultyOnly := r.Group("/api")
	facultyOnly.Use(middleware.AuthorizeRoles("faculty", "student", "Admin"))
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
		facultyOnly.GET("/studentdata/fetchmentees", studentdata.HandleMenteesData)
		facultyOnly.POST("/faculty/newsLetterFormsPost", facultyAchievements.HandleNewsLetterForms)
		facultyOnly.GET("/faculty/newsLetterFormsGet", facultyAchievements.FetchNewsletters)
		facultyOnly.POST("/faculty/eContentFormPost", facultyAchievements.HandleEContentForm)
		facultyOnly.GET("/faculty/eContentGet", facultyAchievements.FetchEContent)
		facultyOnly.POST("/faculty/eventsAttendedPost", facultyAchievements.HandleEventsAttendedForm)
		facultyOnly.GET("/faculty/eventsAttendedGet", facultyAchievements.FetchEventsAttended)
		facultyOnly.POST("/faculty/eventsOrganizedPost", facultyAchievements.HandleEventsOrganizedForm)
		facultyOnly.GET("/faculty/eventsOrganizedGet", facultyAchievements.FetchEventsOrganized)
		facultyOnly.POST("/faculty/externalExaminerPost", facultyAchievements.HandleExternalExaminerForm)
		facultyOnly.GET("/faculty/externalExaminerGet", facultyAchievements.FetchExternalExaminer)
		facultyOnly.POST("/faculty/journalReviewerPost", facultyAchievements.HandleJournalReviewerForm)
		facultyOnly.GET("/faculty/journalReviewerGet", facultyAchievements.FetchJournalReviewer)
		facultyOnly.POST("/faculty/guestLecturePost", facultyAchievements.HandleGuestLectureForm)
		facultyOnly.GET("/faculty/guestLectureGet", facultyAchievements.FetchGuestLecture)
		facultyOnly.POST("/faculty/internationalVisitPost", facultyAchievements.HandleInternationalVisitForm)
		facultyOnly.GET("/faculty/internationalVisitGet", facultyAchievements.FetchInternationalVisit)
		facultyOnly.POST("/faculty/awardPost", facultyAchievements.HandleAwardForm)
		facultyOnly.GET("/faculty/awardGet", facultyAchievements.FetchAward)
		facultyOnly.POST("/faculty/onlineCoursePost", facultyAchievements.HandleOnlineCourseForm)
		facultyOnly.GET("/faculty/onlineCourseGet", facultyAchievements.FetchOnlineCourse)
		facultyOnly.POST("/faculty/paperPresentationPost", facultyAchievements.HandlePaperPresentationForm)
		facultyOnly.GET("/faculty/paperPresentationGet", facultyAchievements.FetchPaperPresentation)
		facultyOnly.POST("/faculty/resourcePersonPost", facultyAchievements.HandleResourcePersonForm)
		facultyOnly.GET("/faculty/resourcePersonGet", facultyAchievements.FetchResourcePerson)

		// Outside World Interaction
		facultyOnly.POST("/faculty/mouPost", outsideWorldInteraction.HandleMouForm)
		facultyOnly.GET("/faculty/mouGet", outsideWorldInteraction.FetchMou)
		facultyOnly.POST("/faculty/irpVisitPost", outsideWorldInteraction.HandleIrpVisitForm)
		facultyOnly.GET("/faculty/irpVisitGet", outsideWorldInteraction.FetchIrpVisit)
		facultyOnly.POST("/faculty/trainedByIndustryPost", outsideWorldInteraction.HandleTrainedByIndustryForm)
		facultyOnly.GET("/faculty/trainedByIndustryGet", outsideWorldInteraction.FetchTrainedByIndustry)
		facultyOnly.POST("/faculty/industryProjectPost", outsideWorldInteraction.HandleIndustryProjectsForm)
		facultyOnly.GET("/faculty/industryProjectGet", outsideWorldInteraction.FetchIndustryProjects)
		facultyOnly.POST("/faculty/externalVipVisitPost", outsideWorldInteraction.HandleExternalVipVisitForm)
		facultyOnly.GET("/faculty/externalVipVisitGet", outsideWorldInteraction.FetchExternalVipVisit)
		facultyOnly.POST("/faculty/coePost", outsideWorldInteraction.HandleCoeForm)
		facultyOnly.GET("/faculty/coeGet", outsideWorldInteraction.FetchCoe)
		facultyOnly.POST("/faculty/consultancyPost", outsideWorldInteraction.HandleConsultancyForm)
		facultyOnly.GET("/faculty/consultancyGet", outsideWorldInteraction.FetchConsultancy)
	}

	bothStudentFacultyAdmin := r.Group("/api")
	bothStudentFacultyAdmin.Use(middleware.AuthorizeRoles("faculty", "student", "Admin"))
	{
		bothStudentFacultyAdmin.GET("/activity_graph/fetchData/:rollno", activitygraph.FetchActivityGraphData)
		bothStudentFacultyAdmin.GET("/achievement_graph/institute_avg/fetchData/:rollno", achievementgraph.HandleFetchInstituteAvg)
		bothStudentFacultyAdmin.GET("/achievement_graph/fetchData/:rollno", achievementgraph.HandleFetchAchievementGraph)
		bothStudentFacultyAdmin.GET("/ps/levels_status/:rollno", pointshandlers.HandleFetchPsLevels)
		bothStudentFacultyAdmin.GET("/ps/metorships/:rollno", dataUploadPs.GetMentorShips)
		bothStudentFacultyAdmin.GET("/resume/getprojects/:rollno", resume.GetProjectsData)
		bothStudentFacultyAdmin.GET("/resume/getcertificates/:rollno", resume.GetCertificatesData)
		bothStudentFacultyAdmin.GET("/resume/gethackathondata/:rollno", resume.GetHackathonData)
		bothStudentFacultyAdmin.GET("/resume/getinternshipdata/:rollno", resume.GetInternshipData)
		bothStudentFacultyAdmin.GET("/resume/getpapers/:rollno", resume.GetPapersData)
		bothStudentFacultyAdmin.GET("/resume/getpatents/:rollno", resume.GetPatentsData)
		bothStudentFacultyAdmin.GET("/resume/dashboardstats/:rollno", resume.GetDashboardStats)
		bothStudentFacultyAdmin.GET("/aresofexpertise/:rollno", resume.GetAreasOfExpertise)
		bothStudentFacultyAdmin.GET("/header/getprofile/:rollno", headerdetails.GetProfileDetails)
	}
	adminOnly := r.Group("/api")
	adminOnly.Use(middleware.AuthorizeRoles("Admin"))
	{
		adminOnly.DELETE("/deleteevents/:id", addevents.DeleteEvent)
		adminOnly.POST("/addevents/create", addevents.AddEvents)
		adminOnly.GET("/events/fetchregisteredteams/:eventcode", registerevents.HandleRegisteredTeams)
		adminOnly.GET("/studentdata/fetchstudentdata", studentdata.HandleMenteesData)
		adminOnly.POST("/mentor-mentee-upload", dataUploadPs.UploadMentorMentee)
		adminOnly.POST("/addusers", login.AddUsers)
		// Admin Dashboard Stats
		adminOnly.GET("/admin/dashboard/stats", admin.GetDashboardStats)
		adminOnly.GET("/admin/dashboard/category-summary", admin.GetCategorySummary)
		adminOnly.GET("/admin/dashboard/user-stats", admin.GetUserStats)
		adminOnly.GET("/admin/dashboard/faculty-performance", admin.GetFacultyPerformance)
		// Admin Analytics
		adminOnly.GET("/admin/analytics", admin.GetAnalytics)
		adminOnly.GET("/admin/analytics/years", admin.GetYearsList)
		adminOnly.GET("/admin/analytics/rollnos", admin.GetRollnosList)
		// Admin Faculty Verifications
		adminOnly.GET("/admin/faculty-verifications", admin.GetAllFacultySubmissions)
		adminOnly.PUT("/admin/faculty-verifications/update-status", admin.UpdateFacultySubmissionStatus)
		// Admin Faculty Metrics
		adminOnly.GET("/admin/faculty-metrics/list", admin.GetFacultyList)
		adminOnly.GET("/admin/faculty-metrics/achievements/:facultyId", admin.GetFacultyAchievements)
	}
	r.GET("/api/activitymaster/fetch", addevents.FetchEvents)
	//both student and faculty
	r.GET("/api/ps/attempts/:rollno", pointshandlers.HandleFetchPsAttempts)
	r.GET("/api/mentor/details/:rollno", pointshandlers.FetchMentorSkillStats)
	r.GET("/api/mentor/institute_avg/fetchData", pointshandlers.FetchSkillWiseAvgMentees)
	r.GET("/api/sem_wise_totaldays", pointshandlers.HandleSemDays)
	r.GET("/api/handlesem", pointshandlers.HandleSem)
	r.PUT("/api/updatesem", pointshandlers.HandleUpdateSem)
	r.DELETE("/api/uploadview/deleteupload", Uploadsdelete.Uploadsdelete)
	r.GET("/api/getpsdata/:rollno", dataUploadPs.GetPsStatus)
	r.POST("/api/bulkupload", dataUploadPs.BulkUploadHandler)
}
