import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Layout, Spin } from "antd";

// Components
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentHome from "./pages/StudentHome";
import CourseList from "./pages/CourseList";
import DocumentList from "./pages/DocumentList";
import CourseManage from "./pages/CourseManage";
import UploadMaterial from "./pages/UploadMaterial";
import TeacherDashboard from "./pages/TeacherDashboard";

const { Content } = Layout;

// ✅ Component tự redirect theo vai trò
function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ textAlign: "center", marginTop: 80 }}><Spin size="large" /></div>;

  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "teacher" ? "/teacher" : "/student"} replace />;
}

// ✅ Route chỉ dành cho người đã đăng nhập
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
          {/* ✅ Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ✅ Trang mặc định redirect theo role */}
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

          {/* ✅ Mặc định: chuyển hướng */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
