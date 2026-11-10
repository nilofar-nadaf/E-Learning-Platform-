import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    const response = await axiosInstance.get("/course/all-courses");
    if (response.data.status === "success") {
      setCourses(response.data.data);
    }
  };

  const fetchStudents = async (courseId) => {
    try {
      const url = courseId ? `/admin/enrolled-students?courseId=${courseId}`: "/admin/enrolled-students";

      const response = await axiosInstance.get(url);
      if (response.data.status === "success") {
        setStudents(response.data.data);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError("Unable to load students");
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchStudents();
  }, []);

  const handleFilterChange = (event) => {
    const courseId = event.target.value;
    setSelectedCourseId(courseId);
    fetchStudents(courseId);
  };

  return (
    <div className="admin-student-list">
      <h1>All Students</h1>

      <label>Filter by Course</label>
      <select value={selectedCourseId} onChange={handleFilterChange}>
        <option value="">All Courses</option>
        {courses.map((course) => (
          <option key={course.COURSE_ID} value={course.COURSE_ID}>
            {course.COURSE_NAME}
          </option>
        ))}
      </select>

      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Reg No</th><th>Name</th><th>Email</th><th>Course</th><th>Mobile No</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.REG_NO}>
              <td>{student.REG_NO}</td>
              <td>{student.NAME}</td>
              <td>{student.EMAIL}</td>
              <td>{student.COURSE_NAME || "N/A"}</td>
              <td>{student.MOBILE_NO}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;