import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Components/Login";
import ProtectedRoute from "./Components/ProtectedRoute";
import Home from "./Pages/Home";
import RegisterCourse from "./Pages/RegisterCourse";
import "./App.css";
import CourseDetail from "./Pages/CourseDetail";
import Profile from "./Pages/Profile";
import ChangePassword from "./Pages/ChangePassword";
import MyCourses from "./Pages/MyCourses";
import VideoPlayer from "./Pages/VideoPlayer";
import CourseList from "./Pages/Admin/CourseList";
import CourseForm from "./Pages/Admin/CourseForm.jsx";
import VideoList from "./Pages/Admin/VideoList";
import VideoForm from "./Pages/Admin/VideoForm";
import StudentList from "./Pages/Admin/StudentList";
function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />}/>                
                <Route path="/" element={<Home/>}/>
                <Route path="/course/:courseId" element={<CourseDetail />} />
                <Route path="/register/:courseId" element={<RegisterCourse />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
                <Route path="/student/my-courses" element={<ProtectedRoute allowedRole="STUDENT"><MyCourses /></ProtectedRoute>} />
                <Route path="/video/:videoId" element={<ProtectedRoute allowedRole="STUDENT"><VideoPlayer /></ProtectedRoute>} />
                <Route path="/admin/courses" element={<ProtectedRoute allowedRole="ADMIN"><CourseList /></ProtectedRoute>} />
                <Route path="/admin/courses/add" element={<ProtectedRoute allowedRole="ADMIN"><CourseForm /></ProtectedRoute>} />
                <Route path="/admin/courses/edit/:courseId" element={<ProtectedRoute allowedRole="ADMIN"><CourseForm /></ProtectedRoute>} />
                <Route path="/admin/videos" element={<ProtectedRoute allowedRole="ADMIN"><VideoList /></ProtectedRoute>} />
                <Route path="/admin/videos/add" element={<ProtectedRoute allowedRole="ADMIN"><VideoForm /></ProtectedRoute>} />
                <Route path="/admin/videos/edit/:videoId" element={<ProtectedRoute allowedRole="ADMIN"><VideoForm /></ProtectedRoute>} />
                <Route path="/admin/students" element={<ProtectedRoute allowedRole="ADMIN"><StudentList /></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;