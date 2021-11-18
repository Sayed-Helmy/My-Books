import React from "react";
import "./CurrentlyReading.css";

export default function CurrentlyReading(props) {
  return (
    <section className="currently-reading">
      <h2>Currently Reading</h2>
      <div className="books-area">{props.children}</div>
    </section>
  );
}
