import React from "react";
import { useNavigate } from "react-router-dom";
import "./summary.css"; // Import the CSS file

const calculateChange = (last, current) => {
    const diff = current - last;
    const percentage = last !== 0 ? ((diff / last) * 100).toFixed(2) : "N/A";
    return { diff, percentage };
  };
  
  function SummaryScreen({ chartData }) {
    const navigate = useNavigate();
  
    // Updated labels
    const activityLabels = {
      BedroomDuration: "Bedroom Duration per Day (hrs)",
      KitchenActivity: "Kitchen Activity per Day (hrs)",
      LivingRoomStay: "Living Room Stay per Day (hrs)",
      BathroomVisits: "Bathroom Visits per Day",
      WalkingAnalysis: "Walk Speed per Day (km/h)", // Updated for speed
      DailyMobility: "Daily Mobility per Day (hrs)",
    };
  
    const lastWeekData = {
      BedroomDuration: 10,
      KitchenActivity: 5,
      LivingRoomStay: 6,
      BathroomVisits: 2,
      WalkingAnalysis: 2.8, // Average walk speed (km/h) last week
      DailyMobility: 4,
    };
  
    const activities = Object.keys(chartData);
  
    return (
      <div className="container">
        <h2>User's Weekly Summary</h2>
        <div className="card-container">
          {activities.map((activity) => {
            const { diff, percentage } = calculateChange(
              lastWeekData[activity],
              chartData[activity].reduce((a, b) => a + b, 0) / chartData[activity].length // Calculate daily average
            );
            const isPositive = diff > 0;
  
            return (
              <div
                key={activity}
                className={`card ${isPositive ? "positive" : "negative"}`}
              >
                <h3>{activityLabels[activity]}</h3>
                <p>
                  Last Week:{" "}
                  {lastWeekData[activity]}{" "}
                  {activity === "WalkingAnalysis" ? "km/h" : "hrs"}
                </p>
                <p>
                  This Week:{" "}
                  {(chartData[activity].reduce((a, b) => a + b, 0) /
                    chartData[activity].length).toFixed(2)}{" "}
                  {activity === "WalkingAnalysis" ? "km/h" : "hrs"}
                </p>
                <p>
                  Change:{" "}
                  <span>
                    {isPositive ? "+" : ""}
                    {percentage}% {isPositive ? "▲" : "▼"}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      <button onClick={() => navigate("/details")} style={{/* padding: 10px; */
    'font-size': '14px',
    'font-weight': 'bold',
    'color': '#ffffff',
    'background': '#3498db',
    'border': 'none',
    'border-radius': '5px',
    'cursor': 'pointer',
    'text-align': 'center',
    'width': '100%',
    'max-width': '200px',
    'margin-top': '20px'}}>
        View Graph
      </button>
    </div>
  );
}

export default SummaryScreen;
