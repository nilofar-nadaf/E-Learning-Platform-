import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/student/profile");
        if (response.data.status === "success") {
          setProfile(response.data.data);
        } else {
          setError(response.data.error);
        }
      } catch (err) {
        setError("Unable to load profile");
      }
    };
    fetchProfile();
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!profile) return <p>Loading...</p>;

  return (
  <div className="profile-container">

    <div className="profile-card">

      {/* Profile Header */}
      <div className="profile-top">

        <div className="profile-avatar">
          {profile.NAME
            ? profile.NAME.charAt(0).toUpperCase()
            : "U"}
        </div>

        <h2>
          {profile.NAME || "Student"}
        </h2>

        <p>
          {profile.EMAIL}
        </p>

      </div>


      {/* Profile Information */}
      <div className="profile-body">

        <h3>Personal Information</h3>

        <div className="profile-info-grid">

          <div className="profile-info-box">
            <span className="label">Full Name</span>

            <span className="value">
              {profile.NAME || "Not set"}
            </span>
          </div>


          <div className="profile-info-box">
            <span className="label">Email Address</span>

            <span className="value">
              {profile.EMAIL}
            </span>
          </div>


          <div className="profile-info-box">
            <span className="label">Mobile Number</span>

            <span className="value">
              {profile.MOBILE_NO || "Not set"}
            </span>
          </div>


          <div className="profile-info-box">
            <span className="label">Account Role</span>

            <span className="value">
              {role}
            </span>
          </div>

        </div>


        {/* Actions */}
        <div className="profile-actions">

          <button
            className="change-password-btn"
            onClick={() => navigate("/change-password")}
          >
            Change Password
          </button>

        </div>

      </div>

    </div>

  </div>
);
}

export default Profile;