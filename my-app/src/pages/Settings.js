import React, { useState } from "react";
import { Link,useNavigate, useLocation } from "react-router-dom";
import "../App.css";


function Settings() {
    const location = useLocation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const { name, age,mac, userID,gender } = location.state || {};
    const alligator = useNavigate();
  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]); // Store the selected file
    setUploadMessage(""); // Clear any previous messages
  };

  // Simulate a mock upload
  const handleMockUpload = (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setUploadMessage("Please select a file to upload.");
      return;
    }

    // Simulate a delay to mock an upload process
    setTimeout(() => {
      setUploadMessage(`Upload successful! File: ${selectedFile.name}`);
    }, 1000); // Mock delay of 1 second
  };

  const pushDB = async () => {
    try {
      const response = await fetch("https://areeya.ngrok.app/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify the content type
        },
        body: JSON.stringify({ name: name, age: age, mac: mac, userID: userID , gender:gender}),
      });
  
      if (!response.ok) {
        throw new Error("Failed to push data to the backend.");
      }
  
      const data = await response.json();
      console.log(data.message); // Log the success message
    } catch (error) {
      console.error("Error pushing data to the backend:", error);
    }
  };
  
  const handleNavigation = () => {
    pushDB()
    alligator('/Done')
  }

  return (
    <div className="phone-container">

      <div style={{ marginTop: "20px", justifyItems:'center', padding:20}}>
        <h2 className="app-header">Upload File</h2>
        <form onSubmit={handleMockUpload}>
          <input type="file" onChange={handleFileChange} />
          <button type="submit" style={{ marginLeft: "10px" }}>
            Upload
          </button>
        </form>
        {uploadMessage && <p>{uploadMessage}</p>}
        <button style={{margin:10}}onClick={handleNavigation}>Confirm</button>
      </div>

      {/* Navigation */}

    </div>
  );
}

export default Settings;
