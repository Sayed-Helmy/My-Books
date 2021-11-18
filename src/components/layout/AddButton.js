import React from "react";
import { Link } from "react-router-dom";
import "./AddButton.css";

export default function AddButton() {
  return (
    <div className="add-button">
      <Link to="/Search">+</Link>
    </div>
  );
}
