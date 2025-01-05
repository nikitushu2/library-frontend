import { gql, useQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
import { BOOKS, ME } from '../queries'

const Recommendations = (props) => {
const data = useQuery(ME)
const favoriteGenre = data?.data?.me?.favoriteGenre

const result = useQuery(BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre})
const [books, setBooks] = useState([])

useEffect(() => {
  if (result.data && !result.loading) {
    setBooks(result.data.allBooks)
  }
}, [result.data])

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>books of your favorite genre</h2>

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
    </div>
  )
}

export default Recommendations
