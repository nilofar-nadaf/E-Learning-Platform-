import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await axiosInstance.post("/user/login",{email: email,password: password,});

      console.log(response.data);

      if (response.data.status === "success") {
        const userData = response.data.data;

        localStorage.setItem("token", userData.token);

        localStorage.setItem("email", userData.email);

        localStorage.setItem("role", userData.role);

        if (response.data.status === "success") {
          const userData = response.data.data;

          localStorage.setItem("token", userData.token);
          localStorage.setItem("email", userData.email);
          localStorage.setItem("role", userData.role);
          localStorage.setItem("isDefaultPassword", userData.isDefaultPassword); // ⬅ new

          navigate("/");
        }
        if (userData.role === "STUDENT") {
          navigate("/");
        } else if (userData.role === "ADMIN") {
          navigate("/");
        }
      } else {
        setError(response.data.error);
      }
    } catch (error) {
      console.log(error);

      setError("Unable to connect to server");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Student Portal</h1>

        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        {message && <p className="success">{message}</p>}

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
export default Login;
