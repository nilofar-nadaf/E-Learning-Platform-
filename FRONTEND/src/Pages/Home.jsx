import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function Home() {
  const navigate = useNavigate();

  // ---------------- STATE ----------------
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  // ---------------- LOGIN DETAILS ----------------
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  const isLoggedIn = !!token;
  const isStudent = role === "STUDENT";
  const isAdmin = role === "ADMIN";

  // ---------------- FETCH COURSES ----------------
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get(
          "/course/all-active-courses"
        );

        if (response.data.status === "success") {
          setCourses(response.data.data);
        } else {
          setError(
            response.data.error || "Unable to load courses"
          );
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load courses");
      }
    };

    fetchCourses();
  }, []);

  // ---------------- NAVIGATION ----------------
  const handleNavigate = (path) => {
    setOpenMenu(null);
    navigate(path);
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ---------------- DROPDOWN ----------------
  const toggleMenu = (menuName) => {
    setOpenMenu(
      openMenu === menuName ? null : menuName
    );
  };

  return (
    <div className="home-container">

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <nav className="top-nav">

        {/* =================================================
            BRAND
            Changes according to role
        ================================================== */}

        <span
          className="brand"
          onClick={() => handleNavigate("/")}
        >
          {isAdmin
            ? "Admin Dashboard"
            : "Student Portal"}
        </span>


        {/* =================================================
            HOME
        ================================================== */}

        <span onClick={() => handleNavigate("/")}>
          Home
        </span>


        {/* =================================================
            STUDENT NAVIGATION
        ================================================== */}

        {isStudent && (
          <span
            onClick={() =>
              handleNavigate("/student/my-courses")
            }
          >
            My Courses
          </span>
        )}


        {/* =================================================
            ADMIN NAVIGATION
        ================================================== */}

        {isAdmin && (
          <>

            {/* COURSES */}

            <div className="nav-dropdown">

              <span
                onClick={() =>
                  toggleMenu("courses")
                }
              >
                Courses ▾
              </span>

              {openMenu === "courses" && (
                <div className="dropdown-menu">

                  <div
                    onClick={() =>
                      handleNavigate("/admin/courses")
                    }
                  >
                    Get All Courses
                  </div>

                  <div
                    onClick={() =>
                      handleNavigate("/admin/courses/add")
                    }
                  >
                    Add Course
                  </div>

                </div>
              )}

            </div>


            {/* VIDEOS */}

            <div className="nav-dropdown">

              <span
                onClick={() =>
                  toggleMenu("videos")
                }
              >
                Videos ▾
              </span>

              {openMenu === "videos" && (
                <div className="dropdown-menu">

                  <div
                    onClick={() =>
                      handleNavigate("/admin/videos")
                    }
                  >
                    Get All Videos
                  </div>

                  <div
                    onClick={() =>
                      handleNavigate("/admin/videos/add")
                    }
                  >
                    Add Video
                  </div>

                </div>
              )}

            </div>


            {/* STUDENTS */}

            <div className="nav-dropdown">

              <span
                onClick={() =>
                  toggleMenu("students")
                }
              >
                Students ▾
              </span>

              {openMenu === "students" && (
                <div className="dropdown-menu">

                  <div
                    onClick={() =>
                      handleNavigate("/admin/students")
                    }
                  >
                    Get All Students
                  </div>

                </div>
              )}

            </div>

          </>
        )}


        {/* =================================================
            RIGHT SIDE
        ================================================== */}

        <div className="nav-right">

          {/* NOT LOGGED IN */}

          {!isLoggedIn && (
            <button
              onClick={() =>
                handleNavigate("/login")
              }
            >
              Login
            </button>
          )}


          {/* LOGGED IN */}

          {isLoggedIn && (
            <div className="profile-menu">

              <div
                className="profile-info"
                onClick={() =>
                  toggleMenu("profile")
                }
              >

                <div className="profile-avatar">
                  {email
                    ? email.charAt(0).toUpperCase()
                    : "U"}
                </div>

                <span>
                  {email} ▾
                </span>

              </div>


              {/* PROFILE DROPDOWN */}

              {openMenu === "profile" && (
                <div className="dropdown-menu profile-dropdown">

                  <div
                    onClick={() =>
                      handleNavigate("/profile")
                    }
                  >
                    👤 My Profile
                  </div>
                  <div onClick={handleLogout}>
                    🚪 Logout
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </nav>


      {/* =====================================================
          HOME CONTENT
      ====================================================== */}

      <main className="home-content">

        <h1 className="home-title">
          Available Courses
        </h1>

        {error && (
          <p className="error">
            {error}
          </p>
        )}


        {/* =================================================
            COURSE GRID
        ================================================== */}

        <div className="course-grid">

          {courses.length === 0 && !error && (
            <p>
              No active courses available.
            </p>
          )}

          {courses.map((course) => (

            <div
              className="course-card"
              key={course.COURSE_ID}
            >

              <h3>
                {course.COURSE_NAME}
              </h3>

              <p>
                {course.DESCRIPTION}
              </p>

              <p>
                <strong>Fees:</strong>{" "}
                ₹{course.FEES}
              </p>

              <p>
                <strong>Starts:</strong>{" "}
                {new Date(
                  course.START_DATE
                ).toDateString()}
              </p>

              <p>
                <strong>Ends:</strong>{" "}
                {new Date(
                  course.END_DATE
                ).toDateString()}
              </p>

              <button
                onClick={() =>
                  handleNavigate(
                    `/course/${course.COURSE_ID}`
                  )
                }
              >
                View More
              </button>

            </div>

          ))}

        </div>

      </main>

    </div>
  );
}

export default Home;