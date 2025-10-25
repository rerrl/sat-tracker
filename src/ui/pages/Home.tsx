import { useState, useEffect } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import SatTracker from "./SatTracker";

export default function Home() {
  const [hideBalances, setHideBalances] = useState(false);

  // useEffect(() => {
  //   const handleBlur = () => {
  //     setHideBalances(true);
  //   };

  //   window.addEventListener('blur', handleBlur);
    
  //   return () => {
  //     window.removeEventListener('blur', handleBlur);
  //   };
  // }, []);

  return (
    <div style={{ width: "100%" }}>
      <div className="navigation-buttons" style={{ marginTop: "15px", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <div className="eye-logos clickable" onClick={() => setHideBalances(!hideBalances)}>
          {hideBalances ? <IoEyeOutline /> : <IoEyeOffOutline />}
        </div>
      </div>
      <SatTracker hideBalances={hideBalances} />
    </div>
  );
}
