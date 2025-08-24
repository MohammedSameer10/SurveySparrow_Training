import React from "react";
import { downloadUserCSV } from "../services/Profile";
import "../styles/DownloadCsv.css";

export default function DownloadCsv() {
  const handleDownload = async () => {
    try {
      await downloadUserCSV();
    } catch (err) {
      console.error("Error downloading CSV:", err);
    }
  };

  return (
    <div className="download-container">
      <button className="download-btn" onClick={handleDownload}>
        Download My Data (CSV)
      </button>
    </div>
  );
}
