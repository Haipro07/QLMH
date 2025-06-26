// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Layout, Spin } from "antd";

// Components
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

// Pages - Sinh viên
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentHome from "./pages/StudentHome";
import CourseList from "./pages/CourseList";
import DocumentList from "./pages/DocumentList";
import Tuition from "./pages/Tuition";
import ProfileStudent from "./pages/ProfileStudent";

// Pages - Giảng viên
import TeacherDashboard from "./pages/TeacherDashboard";
import CourseManage from "./pages/CourseManage";
import UploadMaterial from "./pages/UploadMaterial";
import ProfileTeacher from "./pages/ProfileTeacher";
import StudentList from "./pages/StudentList";

const { Content } = Layout;

// ✅ Component redirect role
function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ textAlign: "center", marginTop: 80 }}><Spin size="large" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "teacher" ? "/teacher" : "/student"} replace />;
}

// ✅ Route chỉ cho người đăng nhập
function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ textAlign: "center", marginTop: 80 }}><Spin size="large" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function AppLayout({ children }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Header />
        <Content style={{ padding: 24 }}>{children}</Content>
      </Layout>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ✅ Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HomeRedirect />} />

          {/* ✅ Sinh viên */}
          <Route
            path="/student"
            element={
              <ProtectedRoute role="student">
                <AppLayout>
                  <StudentHome />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute role="student">
                <AppLayout>
                  <CourseList />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents"
            element={
              <ProtectedRoute role="student">
                <AppLayout>
                  <DocumentList />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tuition"
            element={
              <ProtectedRoute role="student">
                <AppLayout>
                  <Tuition />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile-student"
            element={
              <ProtectedRoute role="student">
                <AppLayout>
                  <ProfileStudent />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* ✅ Giảng viên */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute role="teacher">
                <AppLayout>
                  <TeacherDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-courses"
            element={
              <ProtectedRoute role="teacher">
                <AppLayout>
                  <CourseManage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload-material"
            element={
              <ProtectedRoute role="teacher">
                <AppLayout>
                  <UploadMaterial />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile-teacher"
            element={
              <ProtectedRoute role="teacher">
                <AppLayout>
                  <ProfileTeacher />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-list"
            element={
              <ProtectedRoute role="teacher">
                <AppLayout>
                  <StudentList />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* ✅ Default fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
