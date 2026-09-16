import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axiosInstance.get("/course/all-active-courses");
        if (response.data.status === "success") {
          const found = response.data.data.find(
            (c) => c.COURSE_ID === Number(courseId)
          );
          setCourse(found);
        }
      } catch (err) {
        setError("Unable to load course");
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleRegisterClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      navigate(`/register/${courseId}`);
    }
  };

  if (error) return <p className="error">{error}</p>;

if (!course) return <p className="loading">Loading...</p>;

  return (
  <div className="course-detail-container">

    <div className="course-detail">

      <h1>{course.COURSE_NAME}</h1>

      <p className="description">
        {course.DESCRIPTION}
      </p>

      <div className="course-info">

        <p>
          <strong>Start Date:</strong>{" "}
          {new Date(course.START_DATE).toLocaleDateString()}
        </p>

        <p>
          <strong>End Date:</strong>{" "}
          {new Date(course.END_DATE).toLocaleDateString()}
        </p>

        <p>
          <strong>Fees:</strong> ₹{course.FEES}
        </p>

      </div>

      <button
        className="register-btn"
        onClick={handleRegisterClick}
      >
        Register to Course
      </button>

    </div>

  </div>
);
}

export default CourseDetail;