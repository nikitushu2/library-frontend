import { gql, useQuery, useMutation } from '@apollo/client'
import { useState, useEffect } from 'react'
import { AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = (props) => {
  const result = useQuery(AUTHORS)
  const [authors, setAuthors] = useState([])
  const [name, setName] = useState('')
  const [year, setYear] = useState('')

  const [changeYear] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: AUTHORS }]
  })

  useEffect(() => {
    if (result.data && !result.loading) {
      setAuthors(result.data.allAuthors)
    }
  }, [result.data])

  const submit = async (event) => {
    event.preventDefault()

    console.log('update year...')
    changeYear({variables: {name, year: parseInt(year)}})

    setName('')
    setYear('')
  }

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={submit}>
        <div>
          name
          <select onChange={({ target }) => setName(target.value)}>
            {authors.map((a) => (
              <option key={a.name} value={`${a.name}`}>{a.name}</option>
            ))}
          </select>
        </div>
        <div>
          year
          <input
            value={year}
            onChange={({ target }) => setYear(target.value)}
          />
        </div>
        <button type="submit">update year</button>
      </form>
    </div>
  )
}

export default Authors
