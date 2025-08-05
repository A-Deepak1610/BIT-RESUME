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
import RequestedEvents from "../pages/Achivements/ActivityLogger/RequestedEvents";
import ResumeDraft from "../pages/faculty/resumeDraft/resumeDraft";
import StudentPerformance from "../pages/faculty/performance/facultyStudentPerformance" ;
import ManageActivity from "../pages/faculty/activityTracker/manageActivity/manageActivity";
import StudentResume from "../pages/faculty/resumeDraft/StudentResume"
import Verification from "../pages/faculty/studentRequest/verifications"
import Approvals from "../pages/faculty/studentRequest/approvals"
import AddActivity from "../pages/faculty/add-activity/AddActivity";
import FacultyDashboard from "../pages/faculty/Faculty-Dashboard/facultyDashboard";

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
              <Route path="/Achivement/ActivityMaster" element={<ActivityMaster />} />
              <Route path="/Achivement/ActivityLogger" element={<RegisteredEvents />} />
              <Route path="/Achivement/ActivityLogger/RequestedEvents" element={<RequestedEvents />} />
              <Route path="/uploadview/certificate" element={<CertificateUpload />} />
              <Route path="/uploadview/patent" element={<Patent />} />
              <Route path="/uploadview/project" element={<Project />} />
              <Route path="/uploadview/paperpresentation" element={<PaperPresentation />} />
              <Route path="/uploadview/SeminarOrWorkshop" element={<SeminarOrWorkshop />} />
              <Route path='/uploadview/internship' element={<Internship />} />
            </Route>
            <Route path="/resume" element={<Resume />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["faculty"]} />}>
            <Route element={<DashboardLayout />}> 
              <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
              <Route path="/faculty-resumeDraft" element={<ResumeDraft/>}/>
              <Route path="/faculty-studentperformance" element={<StudentPerformance/>}/>
              <Route path="/faculty-manageActivity" element={<ManageActivity/>}/>
              <Route path="/faculty-verification" element={<Verification/>}/>
              <Route path="/faculty-approval" element={<Approvals/>}/>
            </Route>
            <Route path="/student-resume" element={<StudentResume />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["Admin"]}/>}>
          <Route element={<DashboardLayout/>}>
            <Route path="/admin-addactivity" element={<AddActivity/>}/>
            <Route path="/admin-studentsPerformance" element={<StudentPerformance/>}/>
          </Route>
          <Route path="/admin-resume" element={<Resume/>}/>
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      ) : (
        null
      )}
    </>
  );
}