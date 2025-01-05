import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { useApolloClient } from "@apollo/client";
import Notify from "./components/Notify.jsx"
import LoginForm from "./components/LoginForm.jsx";
import Recommendations from "./components/Recommendations.jsx";

import { useQuery, useMutation, useSubscription } from '@apollo/client'
import { BOOK_ADDED } from "./queries.js";
import { BOOKS } from "./queries.js";

export const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving same person twice
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, (data) => {
    if (!data || !data.allBooks) {
      return { allBooks: [addedBook] }; // Initialize the cache if it's empty
    }

    return {
      allBooks: uniqByTitle(data.allBooks.concat(addedBook)),
    };
  });
}

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      notify(`${addedBook.title} added`)
      updateCache(client.cache, { query: BOOKS }, addedBook)
      client.refetchQueries({
        include: [BOOKS],
      })
    }
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm
          setToken={setToken}
          setError={notify}
        />
      </div>
    )
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <button onClick={logout}>logout</button>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => setPage("recommend")}>recommendations</button>
      </div>

      <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <Recommendations show={page === "recommend"} />
    </div>
  );
};

export default App;
