import React from "react";
import "./NewtonLoader.css";

const NewtonLoader: React.FC = () => {
  return (
    <div className="gooey">
      <span className="dot-loader"></span>
      <div className="dots-loader">
        <span className="span-loader"></span>
        <span className="span-loader"></span>
        <span className="span-loader"></span>
      </div>
    </div>
  );
};

export default NewtonLoader;
