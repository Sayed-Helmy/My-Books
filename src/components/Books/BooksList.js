import React, { Fragment, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AddButton from "../layout/AddButton";
import HomeIcon from "../layout/HomeIcon";
import SearchInput from "../layout/SearchInput";
import Book from "./Book";
import BookShelf from "./BookShelf";
import CurrentlyReading from "./CurrentlyReading";

export default function BooksList() {
  const storedBooks = JSON.parse(localStorage.getItem("Books"));
  const [allBooks, setAllBooks] = useState(storedBooks);
  const [searchedBooks, setSearchedBooks] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [movedItem, setMovedItem] = useState([0]);
  useEffect(() => {
    if (storedBooks) {
      return setAllBooks(storedBooks);
    }
    fetch("https://reactnd-books-api.udacity.com/books", {
      headers: { Authorization: "whatever-you-want" },
    })
      .then((res) => res.json())
      .then((data) => {
        setAllBooks(data.books);
      })
      .catch((error) => console.log(error));
  }, []);
  const onSelectHandler = (selected, selectedID) => {
    if (selected === "none") {
      return setAllBooks(allBooks.filter((book) => book.id !== selectedID));
    }
    if (selected === "currentlyReading") {
      const selectedBook = [...allBooks, ...movedItem].find(
        (book) => book.id === selectedID
      );
      selectedBook.shelf = "currentlyReading";
      return setAllBooks([
        ...allBooks.filter((book) => book.id !== selectedID),
        selectedBook,
      ]);
    }
    if (selected === "wantToRead") {
      const selectedBook = [...allBooks, ...movedItem].find(
        (book) => book.id === selectedID
      );
      selectedBook.shelf = "wantToRead";
      return setAllBooks([
        ...allBooks.filter((book) => book.id !== selectedID),
        selectedBook,
      ]);
    }
    if (selected === "read") {
      const selectedBook = [...allBooks, ...movedItem].find(
        (book) => book.id === selectedID
      );
      selectedBook.shelf = "read";
      return setAllBooks([
        ...allBooks.filter((book) => book.id !== selectedID),
        selectedBook,
      ]);
    }
  };
  useEffect(() => {
    localStorage.setItem("Books", JSON.stringify(allBooks));
  }, [allBooks]);
  const onSearchHandler = (searchValues) => {
    setSearchValue(searchValues);
  };
  useEffect(() => {
    const abortCont = new AbortController();
    if (searchValue.length > 0) {
      fetch(`https://reactnd-books-api.udacity.com/search`, {
        method: "POST",
        headers: {
          Authorization: "whatever-you-want",
          "Content-Type": "application/json",
        },
        signal: abortCont.signal,
        body: JSON.stringify({ query: searchValue, maxResults: 10 }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.books.length > 0) {
            setMovedItem(data.books);
            return setSearchedBooks(data.books);
          } else {
            return setSearchedBooks(null);
          }
        })
        .catch((error) => {
          if (error.name === "AbortError") {
            console.log("post aborted");
          }
        });
    } else {
      return setSearchedBooks(null);
    }
    return () => {
      abortCont.abort();
    };
  }, [searchValue]);
  const resetHandler = () => {
    setSearchedBooks(null);
  };
  return (
    <Router>
      <Fragment>
        <Switch>
          <Route exact path="/">
            <Fragment>
              <AddButton />
              <CurrentlyReading>
                {allBooks &&
                  allBooks
                    .filter((book) => book.shelf === "currentlyReading")
                    .map((book) => {
                      return (
                        <Book
                          id={book.id}
                          title={book.title}
                          authors={book.authors[0]}
                          image={book.imageLinks.thumbnail}
                          onSelect={onSelectHandler}
                          key={book.id}
                        />
                      );
                    })}
              </CurrentlyReading>
              <BookShelf title="Want to Read">
                {allBooks &&
                  allBooks
                    .filter((book) => book.shelf === "wantToRead")
                    .map((book) => {
                      return (
                        <Book
                          id={book.id}
                          title={book.title}
                          authors={book.authors[0]}
                          image={book.imageLinks.thumbnail}
                          onSelect={onSelectHandler}
                          key={book.id}
                        />
                      );
                    })}
              </BookShelf>
              <BookShelf title="Read">
                {allBooks &&
                  allBooks
                    .filter((book) => book.shelf === "read")
                    .map((book) => {
                      return (
                        <Book
                          id={book.id}
                          title={book.title}
                          authors={book.authors[0]}
                          image={book.imageLinks.thumbnail}
                          onSelect={onSelectHandler}
                          key={book.id}
                        />
                      );
                    })}
              </BookShelf>
            </Fragment>
          </Route>
          <Route exact path="/Search">
            <HomeIcon onClick={resetHandler} />
            <SearchInput onSearch={onSearchHandler} />
            <BookShelf title="Search Results" classStyle="search-result">
              {searchedBooks &&
                searchedBooks
                  .filter(
                    (book) =>
                      book.authors !== undefined &&
                      book.imageLinks !== undefined
                  )
                  .map((book) => {
                    return (
                      <Book
                        id={book.id}
                        title={book.title}
                        authors={book.authors[0]}
                        image={book.imageLinks.thumbnail}
                        onSelect={onSelectHandler}
                        key={book.id}
                      />
                    );
                  })}
            </BookShelf>
          </Route>
        </Switch>
      </Fragment>
    </Router>
  );
}
