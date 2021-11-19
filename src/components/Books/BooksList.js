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
  const BookShelves = [
    { title: "Want To Read", key: "wantToRead" },
    { title: "Read", key: "read" },
  ];
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
    fetch("https://reactnd-books-api.udacity.com/books/" + selectedID, {
      method: "PUT",
      headers: {
        Authorization: "whatever-you-want",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shelf: selected }),
    }).then((res) => res.json());
    if (selected === "none") {
      return setAllBooks(allBooks.filter((book) => book.id !== selectedID));
    }
    const selectedBook = [...allBooks, ...movedItem].find(
      (book) => book.id === selectedID
    );
    selectedBook.shelf = selected;
    return setAllBooks([
      ...allBooks.filter((book) => book.id !== selectedID),
      selectedBook,
    ]);
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
          if (data.books.length > 0) {
            data.books.forEach((book) => {
              for (const mainBook of allBooks) {
                if (mainBook.id === book.id) {
                  return (book.shelf = mainBook.shelf);
                } else {
                  book.shelf = "none";
                }
              }
            });
            console.log(data.books);
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
  }, [searchValue, allBooks]);
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
                          authors={book.authors.join(",")}
                          image={book.imageLinks.thumbnail}
                          onSelect={onSelectHandler}
                          key={book.id}
                          shelf={book.shelf}
                        />
                      );
                    })}
              </CurrentlyReading>
              {BookShelves.map((shelf) => {
                return (
                  <BookShelf title={shelf.title} key={shelf.key}>
                    {allBooks &&
                      allBooks
                        .filter((book) => book.shelf === shelf.key)
                        .map((book) => {
                          return (
                            <Book
                              id={book.id}
                              title={book.title}
                              authors={book.authors.join(",")}
                              image={book.imageLinks.thumbnail}
                              onSelect={onSelectHandler}
                              key={book.id}
                              shelf={book.shelf}
                            />
                          );
                        })}
                  </BookShelf>
                );
              })}
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
                        authors={book.authors.join(",")}
                        image={book.imageLinks.thumbnail}
                        onSelect={onSelectHandler}
                        key={book.id}
                        shelf={book.shelf}
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
