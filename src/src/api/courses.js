import axios from "axios";

const API = "http://localhost:3002";       // JSON Server
const UPLOAD_API = "http://localhost:3001"; // Node Upload Server

// ======== COURSES ========

// Lấy tất cả khóa học
export const getCourses = async () => {
  try {
    const res = await axios.get(`${API}/courses`);
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Không thể tải danh sách khóa học"
    );
  }
};

// Lấy danh sách khóa học theo giáo viên
export const getTeacherCourses = async (teacherId) => {
  try {
    const res = await axios.get(`${API}/courses`, {
      params: { teacherId },
    });
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Không thể tải danh sách môn học của giáo viên"
    );
  }
};

// Thêm một khóa học mới
export const addCourse = async (course) => {
  try {
    const res = await axios.post(`${API}/courses`, course);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Thêm khóa học thất bại");
  }
};

// Cập nhật khóa học
export const updateCourse = async (id, updatedCourse) => {
  try {
    const res = await axios.put(`${API}/courses/${id}`, updatedCourse);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Cập nhật khóa học thất bại");
  }
};

// Xoá khóa học
export const deleteCourse = async (id) => {
  try {
    await axios.delete(`${API}/courses/${id}`);
    return true;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Xoá khóa học thất bại");
  }
};

// ======== REGISTRATIONS ========

// Lấy danh sách môn học đã đăng ký của sinh viên
export const getStudentRegistrations = async (studentId) => {
  try {
    const res = await axios.get(`${API}/registrations`, {
      params: { studentId },
    });
    return res.data;
  } catch (err) {
    throw new Error("Không thể lấy danh sách đăng ký");
  }
};

// Đăng ký môn học mới
export const registerCourse = async (studentId, courseId) => {
  try {
    const res = await axios.post(`${API}/registrations`, {
      studentId,
      courseId,
    });
    return res.data;
  } catch (err) {
    throw new Error("Đăng ký môn học thất bại");
  }
};

// Huỷ đăng ký môn học
export const unregisterCourse = async (registrationId) => {
  try {
    await axios.delete(`${API}/registrations/${registrationId}`);
    return true;
  } catch (err) {
    throw new Error("Huỷ đăng ký thất bại");
  }
};

// ======== DOCUMENTS ========

// Lấy tài liệu của một môn học
export const getDocumentsByCourseId = async (courseId) => {
  try {
    const res = await axios.get(`${API}/documents`, {
      params: { courseId },
    });
    return res.data;
  } catch (err) {
    throw new Error("Không thể tải tài liệu");
  }
};

// Lấy toàn bộ tài liệu (nếu cần)
export const getAllDocuments = async () => {
  try {
    const res = await axios.get(`${API}/documents`);
    return res.data;
  } catch (err) {
    throw new Error("Không thể tải danh sách tài liệu");
  }
};
