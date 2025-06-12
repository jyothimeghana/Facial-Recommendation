import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Import the CSS file

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [systemType, setSystemType] = useState("");
    const [result, setResult] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        // Show image preview
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSystemSelect = (system) => {
        setSystemType(system);
        setResult(null); // Reset results
        setSelectedFile(null); // Reset file selection
        setPreview(null);
    };

    const handleUpload = async () => {
        if (!selectedFile || !systemType) {
            alert("Please select a system and upload an image.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("system", systemType);

        try {
            const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setResult(response.data);
        } catch (error) {
            console.error("Error uploading file:", error);
            setResult({ error: "Error making prediction" });
        }
    };

    return (
        <div className="container">
            <h1 className="title">AI Skin Analysis</h1>

            {/* System Selection */}
            <div className="button-group">
                <button
                    className={`option-button ${systemType === "facial" ? "selected" : ""}`}
                    onClick={() => handleSystemSelect("facial")}
                >
                    Facial Ingredients System
                </button>
                <button
                    className={`option-button ${systemType === "color" ? "selected" : ""}`}
                    onClick={() => handleSystemSelect("color")}
                >
                    Color Palette System
                </button>
            </div>

            {systemType && (
                <div className="upload-section">
                    <h2 className="subtitle">{systemType === "facial" ? "Facial Ingredients" : "Color Palette"} System</h2>

                    {/* File Upload */}
                    <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />

                    {/* Image Preview */}
                    {preview && (
                        <div className="preview-container">
                            <img src={preview} alt="Preview" className="preview-image" />
                        </div>
                    )}

                    <button className="upload-button" onClick={handleUpload}>Upload & Predict</button>
                </div>
            )}

            {/* Display Results */}
            {result && (
                <div className="result-container">
                    {result.error && <h2 className="error-message">{result.error}</h2>}

                    {result.system === "facial" && (
                        <>
                            <h2 className="result-title">Facial Ingredients Predictions:</h2>
                            <p>Model 1: {result.prediction1}</p>
                            <p>Model 2: {result.prediction2}</p>
                            <p>Model 3: {result.prediction3}</p>
                        </>
                    )}

                    {result.system === "color" && (
                        <>
                            <h2 className="result-title">Skin Tone: {result.skin_tone}</h2>
                            <h3 className="result-subtitle">Recommended Colors:</h3>
                            <ul className="color-list">
                                {result.recommended_colors.map((color, index) => (
                                    <li key={index} className="color-item">{color}</li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
