import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function CourseForm() {
  const { courseId } = useParams();   // undefined on the /add route, a real value on /edit/:courseId
  const isEditMode = Boolean(courseId);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    courseName: "", description: "", fees: "",
    startDate: "", endDate: "", videoExpireDays: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditMode) {
      const fetchCourse = async () => {
        const response = await axiosInstance.get("/course/all-courses");
        if (response.data.status === "success") {
          const course = response.data.data.find(c => c.COURSE_ID === Number(courseId));
          if (course) {
            setForm({
              courseName: course.COURSE_NAME,
              description: course.DESCRIPTION,
              fees: course.FEES,
              startDate: course.START_DATE.split("T")[0],
              endDate: course.END_DATE.split("T")[0],
              videoExpireDays: course.VIDEO_EXPIRE_DAYS,
            });
          }
        }
      };
      fetchCourse();
    }
  }, [courseId, isEditMode]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = isEditMode
        ? await axiosInstance.put(`/course/update/${courseId}`, form)
        : await axiosInstance.post("/course/add", form);

      if (response.data.status === "success") {
        navigate("/admin/courses");
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError("Unable to save course");
    }
  };

  return (
    <div className="course-form-container">
      <h2>{isEditMode ? "Update Course" : "Add New Course"}</h2>

      <form onSubmit={handleSubmit}>
        <label>Course Name</label>
        <input name="courseName" value={form.courseName} onChange={handleChange} required />

        <label>Description</label>
        <input name="description" value={form.description} onChange={handleChange} />

        <label>Fees</label>
        <input type="number" name="fees" value={form.fees} onChange={handleChange} required />

        <label>Start Date</label>
        <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />

        <label>End Date</label>
        <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required />

        <label>Video Expire Days</label>
        <input type="number" name="videoExpireDays" value={form.videoExpireDays} onChange={handleChange} required />

        <button type="submit">{isEditMode ? "Update Course" : "Add Course"}</button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default CourseForm;