import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout"; // This is your layout with NavBar and SideBar
import Dashboard from "../pages/dashboard/Dashboard"; // Student Dashboard
import Resume from "../pages/resume/Resume";
import UploadView from "../pages/uploadView/UploadView";
import CertificateUpload from "../pages/uploadView/forms/certificate";
import Patent from "../pages/uploadView/forms/patent";
import Project from "../pages/uploadView/forms/project";
import PaperPresentation from "../pages/uploadView/forms/paperPresentation";
import Internship from "../pages/uploadView/forms/internship";
import SeminarOrWorkshop from "../pages/uploadView/forms/seminarOrWorkshop";
import useAuth from "../store/UseAuth";
import RoleRedirect from "../components/auth/RoleRedirect";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import LoadingBar from "../components/loading/Loading";
import PageNotFound from "../pages/404/PageNotFound";
import ActivityMaster from "../pages/Achivements/ActivityMaster/ActivityMaster";
import RegisteredEvents from "../pages/Achivements/ActivityLogger/RegisteredEvents";
import RequestedEvents from "../pages/Achivements/ActivityLogger/RequestedCard";
import ResumeDraft from "../pages/faculty/resumeDraft/resumeDraft";
import StudentPerformance from "../pages/faculty/performance/facultyStudentPerformance";
import ManageActivity from "../pages/faculty/activityTracker/manageActivity/manageActivity";
import StudentResume from "../pages/faculty/resumeDraft/StudentResume";
import Verification from "../pages/faculty/studentRequest/verifications";
import Approvals from "../pages/faculty/studentRequest/approvals";
import FacultyDashboard from "../pages/faculty/Faculty-Dashboard/facultyDashboard";
import DownloadResume from "../pages/resume/downloadResume";
import AdminDashboard from "../pages/Admin/AdminDashboard/AdminDashboard";
import Addusers from "../pages/Admin/AddUsers/Addusers";
import AddActivity from "../pages/faculty/add-activity/AddActivity";
import Reports from "../pages/Admin/reports/Reports";
import FacultyVerifications from "../pages/Admin/FacultyVerifications";
import FacultyAchievements from "../pages/faculty/faculty-achievements/FacultyAchievements";
import NewsletterForm from "../pages/faculty/faculty-achievements/forms/NewsletterForm";
import EContentForm from "../pages/faculty/faculty-achievements/forms/EContentForm";
import EventsAttendedForm from "../pages/faculty/faculty-achievements/forms/EventsAttendedForm";
import EventsOrganizedForm from "../pages/faculty/faculty-achievements/forms/EventsOrganizedForm";
import ExternalExaminerForm from "../pages/faculty/faculty-achievements/forms/ExternalExaminerForm";
import JournalReviewerForm from "../pages/faculty/faculty-achievements/forms/JournalReviewerForm";
import GuestLectureForm from "../pages/faculty/faculty-achievements/forms/GuestLectureForm";
import InternationalVisitForm from "../pages/faculty/faculty-achievements/forms/InternationalVisitForm";
import AwardForm from "../pages/faculty/faculty-achievements/forms/AwardForm";
import OnlineCourseForm from "../pages/faculty/faculty-achievements/forms/OnlineCourseForm";
import PaperForm from "../pages/faculty/faculty-achievements/forms/PaperForm";
import ResourcePersonForm from "../pages/faculty/faculty-achievements/forms/ResourcePersonForm";
import FacultyMetrics from "../pages/Admin/FacultyMetrics/FacultyMetrics";

export default function Applayout() {
  const { fetchUser, user, loading } = useAuth();
  useEffect(() => {
    if (!user && loading) {
      fetchUser();
    }
  }, [fetchUser, user, loading]);
  if (loading && !user) {
    return <LoadingBar />;
  }
  return (
    <>
      <LoadingBar />
      {!loading || user ? (
        <Routes>
          <Route path="/" element={<RoleRedirect />} />
          <Route path="/auth/login" element={<RoleRedirect />} />
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/uploadview" element={<UploadView />} />
              <Route
                path="/Achivement/ActivityMaster"
                element={<ActivityMaster />}
              />
              <Route
                path="/Achivement/ActivityLogger"
                element={<RegisteredEvents />}
              />
              <Route
                path="/Achivement/ActivityLogger/RequestedEvents"
                element={<RequestedEvents />}
              />
              <Route
                path="/uploadview/certificate"
                element={<CertificateUpload />}
              />
              <Route path="/uploadview/patent" element={<Patent />} />
              <Route path="/uploadview/project" element={<Project />} />
              <Route
                path="/uploadview/paperpresentation"
                element={<PaperPresentation />}
              />
              <Route
                path="/uploadview/SeminarOrWorkshop"
                element={<SeminarOrWorkshop />}
              />
              <Route path="/uploadview/internship" element={<Internship />} />
            </Route>
            {/* <Route path="/resume" element={<Resume />} /> */}
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["faculty"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
              <Route path="/faculty-resumeDraft" element={<ResumeDraft />} />
              <Route
                path="/faculty-studentperformance"
                element={<StudentPerformance />}
              />
              <Route
                path="/faculty-manageActivity"
                element={<ManageActivity />}
              />
              <Route path="/faculty-verification" element={<Verification />} />
              <Route path="/faculty-approval" element={<Approvals />} />
              <Route
                path="/faculty/uploadview"
                element={<FacultyAchievements />}
              />

              {/* Specific routes for each achievement form */}
              <Route
                path="/faculty/achievements/newsletter"
                element={<NewsletterForm />}
              />
              <Route
                path="/faculty/achievements/e-content"
                element={<EContentForm />}
              />
              <Route
                path="/faculty/achievements/events-attended"
                element={<EventsAttendedForm />}
              />
              <Route
                path="/faculty/achievements/events-organized"
                element={<EventsOrganizedForm />}
              />
              <Route
                path="/faculty/achievements/external-examiner"
                element={<ExternalExaminerForm />}
              />
              <Route
                path="/faculty/achievements/journal-reviewer"
                element={<JournalReviewerForm />}
              />
              <Route
                path="/faculty/achievements/guest-lectures"
                element={<GuestLectureForm />}
              />
              <Route
                path="/faculty/achievements/international-visits"
                element={<InternationalVisitForm />}
              />
              <Route
                path="/faculty/achievements/awards"
                element={<AwardForm />}
              />
              <Route
                path="/faculty/achievements/online-courses"
                element={<OnlineCourseForm />}
              />
              <Route
                path="/faculty/achievements/papers"
                element={<PaperForm />}
              />
              <Route
                path="/faculty/achievements/resource-person"
                element={<ResourcePersonForm />}
              />
            </Route>
            <Route path="/student-resume" element={<StudentResume />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin-addactivity" element={<AddActivity />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-reports" element={<Reports />} />
              <Route path="/admin-AddUsers" element={<Addusers />} />
              <Route
                path="/admin-studentsPerformance"
                element={<StudentPerformance />}
              />
              <Route
                path="/admin-facultyMetrics"
                element={<FacultyMetrics/>}
              />
              <Route
                path="/admin-facultyVerifications"
                element={<FacultyVerifications />}
              />
            </Route>
            <Route path="/admin-resume" element={<Resume />} />
          </Route>
          {/* Both faculty and Student */}
          <Route path="/downloadResume" element={<DownloadResume />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      ) : null}
    </>
  );
}
