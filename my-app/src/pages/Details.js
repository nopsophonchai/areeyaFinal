import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const calculateAverage = (data) => {
  if (!data || data.length === 0) return 0;
  const sum = data.reduce((acc, val) => acc + val, 0);
  return (sum / data.length).toFixed(2); // Rounded to 2 decimal places
};

const colorMapping = {
  BedroomDuration: "#3498db",
  KitchenActivity: "#e74c3c",
  LivingRoomStay: "#2ecc71",
  BathroomVisits: "#f1c40f",
  WalkingAnalysis: "#9b59b6",
  DailyMobility: "#34495e",
};

const activityUnits = {
  BedroomDuration: "hrs",
  KitchenActivity: "hrs",
  LivingRoomStay: "hrs",
  BathroomVisits: "visits",
  WalkingAnalysis: "km/h", // Updated unit for Walk Speed
  DailyMobility: "hrs",
};

function DetailsScreen({ chartData }) {
  const navigate = useNavigate();
  const [currentActivity, setCurrentActivity] = useState("BedroomDuration");
  const [currentData, setCurrentData] = useState(chartData.BedroomDuration || []);
  const [average, setAverage] = useState(() => calculateAverage(chartData.BedroomDuration || []));

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const data = {
    labels,
    datasets: [
      {
        label: `Weekly ${currentActivity.replace(/([A-Z])/g, " $1").trim()}`,
        data: currentData,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  const handleSetData = (key) => {
    setCurrentActivity(key);
    setCurrentData(chartData[key] || []);
    setAverage(calculateAverage(chartData[key] || []));
  };

  return (
    <div className="container">
      <h2>User's Weekly Graph</h2>
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>
      <p>
        Average {currentActivity.replace(/([A-Z])/g, " $1").trim()}: {average}{" "}
        {activityUnits[currentActivity]}
      </p>
      <div className="button-group">
        {Object.keys(chartData).map((key) => (
          <button
            key={key}
            onClick={() => handleSetData(key)}
            style={{ backgroundColor: colorMapping[key] }}
            className="btn"
          >
            {key.replace(/([A-Z])/g, " $1").trim()}
          </button>
        ))}
      </div>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Navigate back to the previous page
        style={{'padding': '10px',
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
            'margin-top': '20px'}}
      >
        Back
      </button>
    </div>
  );
}

export default DetailsScreen;
