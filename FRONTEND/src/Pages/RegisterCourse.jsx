import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function RegisterCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const email = localStorage.getItem("email"); // already known — set at login

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axiosInstance.post("/student/register-to-course", {
        courseId: Number(courseId),
        name,
        mobileNo,
      });

      if (response.data.status === "success") {
        setMessage("Registered successfully!");
        setTimeout(() => navigate("/student/my-courses"), 1500);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError("Unable to register. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <h2>Register to Course</h2>

      <form onSubmit={handleRegister}>
        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email Address</label>
        <input type="email" value={email} disabled />

        <label>Mobile Number</label>
        <input
          type="text"
          placeholder="Enter your mobile number"
          value={mobileNo}
          onChange={(e) => setMobileNo(e.target.value)}
          required
        />

        <button type="submit">Register</button>
      </form>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default RegisterCourse;