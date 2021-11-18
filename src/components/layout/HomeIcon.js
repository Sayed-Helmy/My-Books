import React from "react";
import "./HomeIcon.css";
import homeImage from "../../assets/home-solid.svg";
import { Link } from "react-router-dom";
export default function HomeIcon(props) {
  return (
    <div className="home-icon" onClick={props.onClick}>
      <Link to="/">
        <img src={homeImage} alt="" />
      </Link>
    </div>
  );
}
