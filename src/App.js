import React, { Fragment } from "react";
import BooksList from "./components/Books/BooksList";
import Header from "./components/layout/Header";

function App() {
  return (
    <Fragment>
      <Header />
      <main>
        <BooksList />
      </main>
    </Fragment>
  );
}

export default App;
