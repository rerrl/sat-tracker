import { useState } from "react";
import SatTracker from "./SatTracker";
import SatCharter from "./SatCharter";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"tracker" | "charter">("tracker");

  return (
    <div style={{ width: "100%" }}>
      <div className="navigation-buttons">
        {currentPage === "tracker" ? (
          <button onClick={() => setCurrentPage("charter")}>Go to Sat Charter</button>
        ) : (
          <button onClick={() => setCurrentPage("tracker")}>Back to Tracker</button>
        )}
      </div>
      {currentPage === "tracker" ? <SatTracker /> : <SatCharter />}
    </div>
  );
}
