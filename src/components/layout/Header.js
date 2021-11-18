import React, { Fragment } from "react";
import "./Header.css";
import booksImage from "../../assets/bookImage.jpg";

export default function Header() {
  return (
    <Fragment>
      <header className="header">
        <h1>My Books</h1>
      </header>
      <div className="main-image">
        <img src={booksImage} alt="A Shelfes Full Of Books..." />
      </div>
    </Fragment>
  );
}
