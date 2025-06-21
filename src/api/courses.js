import axios from "axios";

const API = "";

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
