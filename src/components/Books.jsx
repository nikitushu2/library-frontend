import { gql, useQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
import { BOOKS } from '../queries'

const Books = (props) => {
const [genre, setGenre] = useState('')
const [books, setBooks] = useState([])
const [genres, setGenres] = useState([])

const result = useQuery(BOOKS, {
  variables: { genre: genre }
})

useEffect(() => {
  if (result.data && !result.loading) {
    setBooks(result.data.allBooks)
  }
}, [result.data])

const handleGenreClick = (selectedGenre) => {
  setGenre(selectedGenre)
  result.refetch({ genre: selectedGenre })
}

  if (!props.show) {
    return null
  }


  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {books.map((a) => (
            a.genres.map(genre => (
              !genres.includes(genre) && setGenres(genres.concat(genre))
            ))
          ))}
        {genres.map(genre => (
          <button key={genre} onClick={() => /*setBooks(initialBooks.filter(book => book.genres.includes(genre)))*/handleGenreClick(genre)}>{genre}</button>
        ))}
        <button onClick={() => handleGenreClick('')}>all genres</button>
    </div>
  )
}

export default Books
