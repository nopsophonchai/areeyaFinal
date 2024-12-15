import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
    const handleClose = () => {
        window.close();
      };
  return (
    <div className="phone-container" style={{justifyItems:'center'}}>
        <h1 className="app-header">Setup Complete!</h1>
        <p className="app-header">There will be a 2 week data collection phase</p>
        <p className="app-header">Areeya will ask questions based on recorded actions</p>
        <p className="app-header">Please close this page</p>
    </div>
  );
}

export default Home;
