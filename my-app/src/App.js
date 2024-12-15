import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Done from "./pages/Done";
import SummaryScreen from "./pages/Report";
import DetailsScreen from "./pages/Details";
import chartData from './data.json'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/Done" element={<Done />} />
        <Route path="/Summary" element={<SummaryScreen chartData={chartData} />} />
        <Route path="/Details" element={<DetailsScreen chartData={chartData} />} />
      </Routes>
    </Router>
  );
}

export default App;
