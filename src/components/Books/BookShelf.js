import React, { useRef } from "react";
import "./BookShelf.css";
export default function BookShelf(props) {
  const bookArea = useRef();
  const rightArrow = () => {
    if (bookArea.current.childNodes.length > 6) {
      bookArea.current.style.justifyContent = "flex-start";
    }
    bookArea.current.scrollLeft += 140;
  };
  const leftArrow = () => {
    if (bookArea.current.childNodes.length > 6) {
      console.log(bookArea.current.childNodes.length);
      bookArea.current.style.justifyContent = "flex-start";
    }
    bookArea.current.scrollLeft -= 140;
  };

  return (
    <div className="book-shelf">
      <h2>{props.title}</h2>
      <div className={`books-area ${props.classStyle}`} ref={bookArea}>
        <i
          className="fas fa-chevron-right right-arrow"
          onClick={rightArrow}
        ></i>
        {props.children}
        <i className="fas fa-chevron-left left-arrow" onClick={leftArrow}></i>
      </div>
    </div>
  );
}
