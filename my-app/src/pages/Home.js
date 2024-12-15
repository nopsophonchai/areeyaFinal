import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";

function Home() {
    const location = useLocation();
    const [name, setName] = useState("");
    const [userID, setUserID] = useState(null);
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("Male");
    const navigate = useNavigate();

    const handleAgeChange = (event) => {
        setAge(event.target.value);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    const handleNavigate = () => {
        navigate("/Profile", { state: { name, age, gender, userID } });
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const userIDFromURL = queryParams.get("userID");
        setUserID(userIDFromURL);
    }, [location.search]);

    const styles = {
        container: {
            marginTop: "60px", // Ensures space below URL bar
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
            maxWidth: "400px",
            margin: "auto",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        },
        input: {
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            width: "100%",
            marginTop: "10px",
            marginBottom: "20px",
        },
        radioGroup: {
            marginTop: "10px",
            marginBottom: "20px",
        },
        button: {
            padding: "10px 20px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
            width: "100%",
        },
        buttonHover: {
            backgroundColor: "#2c80b4",
        },
        header: {
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "20px",
        },
        subHeader: {
            fontSize: "18px",
            fontWeight: "400",
            color: "#555",
            marginBottom: "20px",
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Hello, I'm Areeya!</h1>
            <p style={styles.subHeader}>Who do you want me to take care of?</p>
            <div>
                <p>Name</p>
                <input
                    type="text"
                    onChange={handleNameChange}
                    value={name}
                    placeholder="Enter name"
                    style={styles.input}
                />
            </div>
            <div>
                <p>Age</p>
                <input
                    type="number"
                    value={age}
                    onChange={handleAgeChange}
                    min="1"
                    max="100"
                    placeholder="Enter age"
                    style={styles.input}
                />
                {age && <p>Selected Age: {age}</p>}
            </div>
            <div style={styles.radioGroup}>
                <p>Gender</p>
                <label>
                    <input
                        type="radio"
                        value="Male"
                        checked={gender === "Male"}
                        onChange={handleGenderChange}
                    />
                    Male
                </label>
                <label style={{ marginLeft: "10px" }}>
                    <input
                        type="radio"
                        value="Female"
                        checked={gender === "Female"}
                        onChange={handleGenderChange}
                    />
                    Female
                </label>
            </div>
            <button
                style={styles.button}
                onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                onClick={handleNavigate}
            >
                Confirm!
            </button>
        </div>
    );
}

export default Home;
