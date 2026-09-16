import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function CourseList() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get("/course/all-courses");
      if (response.data.status === "success") {
        setCourses(response.data.data);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError("Unable to load courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (courseId) => {
    if (!window.confirm("Delete this course? This cannot be undone.")) return;

    try {
      const response = await axiosInstance.delete(`/course/delete/${courseId}`);
      if (response.data.status === "success") {
        fetchCourses(); // refresh the list after deleting
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      alert("Unable to delete course");
    }
  };

  return (
    <div className="admin-course-list">
      <h1>All Courses</h1>
      <button onClick={() => navigate("/admin/courses/add")}>+ Add Course</button>

      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Course Name</th><th>Fees</th>
            <th>Start Date</th><th>End Date</th><th>Expire Days</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.COURSE_ID}>
              <td>{course.COURSE_ID}</td>
              <td>{course.COURSE_NAME}</td>
              <td>₹{course.FEES}</td>
              <td>{new Date(course.START_DATE).toDateString()}</td>
              <td>{new Date(course.END_DATE).toDateString()}</td>
              <td>{course.VIDEO_EXPIRE_DAYS}</td>
              <td>
                <button onClick={() => navigate(`/admin/courses/edit/${course.COURSE_ID}`)}>✏️</button>
                <button onClick={() => handleDelete(course.COURSE_ID)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CourseList;