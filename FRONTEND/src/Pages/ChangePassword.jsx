import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axiosInstance.put("/student/change-password", {
        newPassword,
        confirmPassword,
      });

      if (response.data.status === "success") {
        setMessage("Password changed successfully!");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError("Unable to change password");
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>

      <form onSubmit={handleSubmit}>
        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Update Password</button>
      </form>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default ChangePassword;