import { useState, useEffect } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import SatTracker from "./SatTracker";
import SatCharter from "./SatCharter";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"tracker" | "charter">("tracker");
  const [hideBalances, setHideBalances] = useState(false);

  useEffect(() => {
    const handleBlur = () => {
      setHideBalances(true);
    };

    window.addEventListener('blur', handleBlur);
    
    return () => {
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <div className="navigation-buttons" style={{ marginTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          {currentPage === "tracker" ? (
            <button onClick={() => setCurrentPage("charter")}>Go to Sat Charter</button>
          ) : (
            <button onClick={() => setCurrentPage("tracker")}>Back to Tracker</button>
          )}
        </div>
        <div className="eye-logos clickable" onClick={() => setHideBalances(!hideBalances)}>
          {hideBalances ? <IoEyeOutline /> : <IoEyeOffOutline />}
        </div>
      </div>
      {currentPage === "tracker" ? 
        <SatTracker hideBalances={hideBalances} /> : 
        <SatCharter hideBalances={hideBalances} />
      }
    </div>
  );
}
