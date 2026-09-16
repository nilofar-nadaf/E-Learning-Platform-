import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function VideoList() {
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [error, setError] = useState("");

  // Fetch the course list once — used both for the filter dropdown and for showing course names
  const fetchCourses = async () => {
    const response = await axiosInstance.get("/course/all-courses");
    if (response.data.status === "success") {
      setCourses(response.data.data);
    }
  };

  const fetchVideos = async (courseId) => {
    try {
      const url = courseId
        ? `/video/all-videos?courseId=${courseId}`
        : "/video/all-videos";

      const response = await axiosInstance.get(url);
      if (response.data.status === "success") {
        setVideos(response.data.data);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError("Unable to load videos");
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchVideos();
  }, []);

  const handleFilterChange = (event) => {
    const courseId = event.target.value;
    setSelectedCourseId(courseId);
    fetchVideos(courseId);
  };

  // Your VIDEOS table only stores COURSE_ID, not the course name —
  // so we look it up from the courses list we already fetched.
  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.COURSE_ID === courseId);
    return course ? course.COURSE_NAME : "N/A";
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm("Delete this video?")) return;

    try {
      const response = await axiosInstance.delete(`/video/delete/${videoId}`);
      if (response.data.status === "success") {
        fetchVideos(selectedCourseId);
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      alert("Unable to delete video");
    }
  };

  return (
    <div className="admin-video-list">
      <h1>All Videos</h1>

      <label>Filter by Course</label>
      <select value={selectedCourseId} onChange={handleFilterChange}>
        <option value="">All Courses</option>
        {courses.map((course) => (
          <option key={course.COURSE_ID} value={course.COURSE_ID}>
            {course.COURSE_NAME}
          </option>
        ))}
      </select>

      <button onClick={() => navigate("/admin/videos/add")}>+ Add Video</button>

      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Course</th><th>Title</th><th>Description</th>
            <th>YouTube URL</th><th>Added At</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <tr key={video.VIDEO_ID}>
              <td>{video.VIDEO_ID}</td>
              <td>{getCourseName(video.COURSE_ID)}</td>
              <td>{video.TITLE}</td>
              <td>{video.DESCRIPTION}</td>
              <td><a href={video.YOUTUBE_URL} target="_blank" rel="noreferrer">link</a></td>
              <td>{new Date(video.ADDED_AT).toDateString()}</td>
              <td>
                <button onClick={() => navigate(`/admin/videos/edit/${video.VIDEO_ID}`)}>✏️</button>
                <button onClick={() => handleDelete(video.VIDEO_ID)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VideoList;