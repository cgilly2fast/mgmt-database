import React from "react";
import { useNavigate } from "react-router-dom";
import back from "../../../img/back.svg";
import "./BackWithTitle.css";

const BackWithTitle: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div
        onClick={() => navigate(-1)}
        style={{ width: "60px", cursor: "pointer", paddingBottom: "20px" }}
      >
        <img src={back} alt="back" className="back-img" />
        <span>Back</span>
      </div>
      <div>
        <h4 className="add-images-title">Review your home tour</h4>
        <p>
          Assign the right photos to the right rooms. With photos captions, you
          can also add a sentence or two about what makes your space special.
        </p>
      </div>
    </div>
  );
};

export default BackWithTitle;
