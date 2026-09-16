import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function VideoForm() {
  const { videoId } = useParams();
  const isEditMode = Boolean(videoId);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    courseId: "", title: "", youtubeURL: "", description: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await axiosInstance.get("/course/all-courses");
      if (response.data.status === "success") {
        setCourses(response.data.data);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      const fetchVideo = async () => {
        const response = await axiosInstance.get("/video/all-videos");
        if (response.data.status === "success") {
          const video = response.data.data.find(v => v.VIDEO_ID === Number(videoId));
          if (video) {
            setForm({
              courseId: video.COURSE_ID,
              title: video.TITLE,
              youtubeURL: video.YOUTUBE_URL,
              description: video.DESCRIPTION,
            });
          }
        }
      };
      fetchVideo();
    }
  }, [videoId, isEditMode]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = isEditMode
        ? await axiosInstance.put(`/video/update/${videoId}`, form)
        : await axiosInstance.post("/video/add", form);

      if (response.data.status === "success") {
        navigate("/admin/videos");
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError("Unable to save video");
    }
  };

  return (
    <div className="video-form-container">
      <h2>{isEditMode ? "Edit Video" : "Add New Video"}</h2>

      <form onSubmit={handleSubmit}>
        <label>Course</label>
        <select name="courseId" value={form.courseId} onChange={handleChange} required>
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.COURSE_ID} value={course.COURSE_ID}>
              {course.COURSE_NAME}
            </option>
          ))}
        </select>

        <label>Video Title</label>
        <input name="title" value={form.title} onChange={handleChange} required />

        <label>YouTube URL</label>
        <input name="youtubeURL" value={form.youtubeURL} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} />

        <button type="submit">{isEditMode ? "Update Video" : "Add Video"}</button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default VideoForm;