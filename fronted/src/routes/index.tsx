import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";

import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import Assignments from "../pages/Assignment/Assignments";
import NotFound from "../pages/NotFound";
import PublicSurvey from "../pages/PublicSurvey";

import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLatout";
import SupervisorLayout from "../layouts/SupervisorLayout";
import Surveys from "../pages/Surveys";
import SurveyCreate from "../pages/SurveyCreate";
import SurveyBuilder from "../pages/SurveyBuilder";
import SurveyPreview from "../pages/SuvreyPreview";
import SurveyShare from "../pages/SurveyShare";
import ReportDashboard from "../pages/Reports/Dashboard";
import Users from "../pages/Users/Users";

import InterviewerLayout from "../layouts/InterviewerLayout";

import AssignmentDetail from "../components/assignments/AssignmentDetail";
import RoleRoute from "./RoleRute";
import MyAssignments from "../pages/Inverviewer/MyAssignments";
import SubmissionReviews from "../pages/SubmissionReviews";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* =====================================================
          DASHBOARD ADMIN / EDITOR / VIEWER
         ===================================================== */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute roles={["ADMIN", "EDITOR", "VIEWER"]}>
              <DashboardLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route
          index
          element={
            <RoleRoute roles={["ADMIN", "EDITOR", "VIEWER"]}>
              <Dashboard />
            </RoleRoute>
          }
        />

        {/* ================= ENCUESTAS ================= */}

        <Route
          path="surveys"
          element={
            <RoleRoute roles={["ADMIN", "EDITOR", "VIEWER"]}>
              <Surveys />
            </RoleRoute>
          }
        />

        {/* Crear encuesta → ADMIN + EDITOR */}
        <Route
          path="surveys/new"
          element={
            <RoleRoute roles={["ADMIN", "EDITOR"]}>
              <SurveyCreate />
            </RoleRoute>
          }
        />

        {/* Builder → ADMIN + EDITOR */}
        <Route
          path="surveys/:id/builder"
          element={
            <RoleRoute roles={["ADMIN", "EDITOR"]}>
              <SurveyBuilder />
            </RoleRoute>
          }
        />

        {/* Preview → todos */}
        <Route
          path="surveys/:id/preview"
          element={
            <RoleRoute roles={["ADMIN", "EDITOR", "VIEWER"]}>
              <SurveyPreview />
            </RoleRoute>
          }
        />

        {/* Compartir → ADMIN + EDITOR */}
        <Route
          path="surveys/:token/share"
          element={
            <RoleRoute roles={["ADMIN", "EDITOR"]}>
              <SurveyShare />
            </RoleRoute>
          }
        />

        {/* ================= USUARIOS ================= */}

        {/* Solo ADMIN */}
        <Route
          path="users"
          element={
            <RoleRoute roles={["ADMIN"]}>
              <Users />
            </RoleRoute>
          }
        />

        {/* ================= ASIGNACIONES ================= */}

        {/* ADMIN + EDITOR */}
        <Route
          path="assignments"
          element={
            <RoleRoute roles={["ADMIN", "EDITOR"]}>
              <Assignments />
            </RoleRoute>
          }
        />

        {/* ================= REPORTES ================= */}

        {/* ADMIN + EDITOR + VIEWER */}
        <Route
          path="reports"
          element={
            <RoleRoute roles={["ADMIN", "EDITOR", "VIEWER"]}>
              <Reports />
            </RoleRoute>
          }
        />

        <Route
          path="reports/:surveyId"
          element={
            <RoleRoute roles={["ADMIN", "EDITOR", "VIEWER"]}>
              <ReportDashboard />
            </RoleRoute>
          }
        />

        {/* ================= CONFIGURACIÓN ================= */}

        {/* Solo ADMIN */}
        <Route
          path="settings"
          element={
            <RoleRoute roles={["ADMIN"]}>
              <Settings />
            </RoleRoute>
          }
        />
      </Route>

      {/* =====================================================
          SUPERVISOR (Sin menú lateral)
         ===================================================== */}

      <Route
        path="/dashboard/reviews"
        element={
          <ProtectedRoute>
            <RoleRoute roles={["SUPERVISOR"]}>
              <SupervisorLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<SubmissionReviews />} />
      </Route>

      {/* =====================================================
          ENTREVISTADOR
         ===================================================== */}

      <Route
        path="/interviewer"
        element={
          <ProtectedRoute>
            <RoleRoute roles={["INTERVIEWER"]}>
              <InterviewerLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<MyAssignments />} />

        <Route path="assignments/:id" element={<AssignmentDetail />} />
      </Route>

      {/* ENCUESTA PÚBLICA */}
      <Route path="/s/:token" element={<PublicSurvey />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
