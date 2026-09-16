import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";


function MyCourses() {
  const navigate = useNavigate();

  const [groupedCourses, setGroupedCourses] = useState([]);
  const [openCourseId, setOpenCourseId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Group videos under their respective course
  const groupByCourse = (rows) => {
    const map = {};

    rows.forEach((row) => {
      if (!map[row.COURSE_ID]) {
        map[row.COURSE_ID] = {
          courseId: row.COURSE_ID,
          courseName: row.COURSE_NAME,
          startDate: row.START_DATE,
          endDate: row.END_DATE,
          videos: [],
        };
      }

      if (row.VIDEO_ID) {
        map[row.COURSE_ID].videos.push({
          videoId: row.VIDEO_ID,
          title: row.TITLE,
          addedAt: row.ADDED_AT,
        });
      }
    });

    return Object.values(map);
  };

  // Fetch registered courses
  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await axiosInstance.get(
          "/student/my-course-with-videos"
        );

        if (response.data.status === "success") {
          setGroupedCourses(groupByCourse(response.data.data));
        } else {
          setError(response.data.error);
        }
      } catch (err) {
        setError("Unable to load your courses");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  // Open / close course
  const toggleCourse = (courseId) => {
    setOpenCourseId(
      openCourseId === courseId ? null : courseId
    );
  };

  if (loading) {
    return (
      <div className="my-courses-container">
        <p className="loading">Loading your courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-courses-container">
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="my-courses-container">

      <h1>My Registered Courses</h1>

      {groupedCourses.length === 0 ? (
        <div className="no-courses">
          <p>You have not registered for any course yet.</p>

          <button onClick={() => navigate("/")}>
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="accordion-container">

          {groupedCourses.map((course) => (
            <div
              className="accordion-item"
              key={course.courseId}
            >

              {/* Course Header */}

              <div
                className="accordion-header"
                onClick={() =>
                  toggleCourse(course.courseId)
                }
              >
                <strong>{course.courseName}</strong>

                <span>
                  {openCourseId === course.courseId
                    ? "▲"
                    : "▼"}
                </span>
              </div>

              {/* Course Details */}

              {openCourseId === course.courseId && (
                <div className="accordion-body">

                  <div className="course-dates">
                    <p>
                      <strong>Start Date:</strong>{" "}
                      {new Date(
                        course.startDate
                      ).toDateString()}
                    </p>

                    <p>
                      <strong>End Date:</strong>{" "}
                      {new Date(
                        course.endDate
                      ).toDateString()}
                    </p>
                  </div>

                  <h4>Course Videos</h4>

                  {course.videos.length === 0 ? (
                    <div className="expired-message">
                      Access to videos has expired
                      for this course.
                    </div>
                  ) : (
                    <div className="video-list">

                      {course.videos.map((video) => (
                        <div
                          className="video-item"
                          key={video.videoId}
                          onClick={() =>
                            navigate(
                              `/video/${video.videoId}`
                            )
                          }
                        >

                          <div>
                            <p className="video-title">
                              {video.title}
                            </p>

                            <p className="video-added">
                              Added:{" "}
                              {new Date(
                                video.addedAt
                              ).toDateString()}
                            </p>
                          </div>

                          <span className="video-arrow">
                            →
                          </span>

                        </div>
                      ))}

                    </div>
                  )}

                </div>
              )}

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default MyCourses;