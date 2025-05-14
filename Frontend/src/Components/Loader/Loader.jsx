import React from "react";
import { FadeLoader } from "react-spinners";

const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "60vh", 
        width: "100vw",
        position: "fixed", 
        top: 0,
        left: 0,
        zIndex: 1000, 
      }}
    >
      <FadeLoader color="#F9B02E" />
    </div>
  );
};

export default Loader;