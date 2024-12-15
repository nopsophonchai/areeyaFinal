import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Profile.css"; // Import the CSS file
import "../App.css";

function Profile() {
  const location = useLocation();
  const { name, age, userID,gender } = location.state || {};
  const alligator = useNavigate();
  const [mac,setMac] = useState('C3:00:00:2E:6C:06')
  console.log(name);
  console.log(age);
  const handleNavigation = () => {
    alligator('/Settings',{state:{name,age,mac, userID,gender}})
  }

  return (
    <div className="phone-container">
      <h1 className="app-header">Connect Tag</h1>
      <div style={{justifyItems:'center'}}>
        <img
          src="/Invite_Bot_5.png" // Update this path to the correct image location
          alt="Profile Icon"
          className="profile-image"
        />
        <h1 className="app-header">C3:00:00:2E:6C:06</h1>
        <button onClick={handleNavigation}>Connect!</button>
      </div>
    </div>
  );
}

export default Profile;
