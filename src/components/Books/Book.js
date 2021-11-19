import React from "react";
import "./Book.css";

export default function Book(props) {
  const onSelectShelf = (e) => {
    props.onSelect(e.target.value, props.id);
  };
  return (
    <div className="book-style">
      <div className="book-top">
        <div
          className="book-cover"
          style={{
            backgroundImage: "url(" + props.image + ")",
            backgroundSize: "cover",
          }}
        ></div>
        <div className="book-shelf-changer">
          <select onChange={onSelectShelf} value={props.shelf}>
            <option value="move" disabled>
              Move To
            </option>
            <option value="currentlyReading">Currently Reading</option>
            <option value="wantToRead">Want To Read</option>
            <option value="read">Read</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>
      <div className="book-title">{props.title}</div>
      <div className="book-authors">{props.authors}</div>
    </div>
  );
}
