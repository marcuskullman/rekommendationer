import { useAppContext } from "../hooks"

const OutputLayer = () => {
  const [{ result }, dispatch] = useAppContext()

  return (
    <>
      <h1>Output layer</h1>
      <button type="button" onClick={() => dispatch({ view: "input" })}>
        Ny sökning
      </button>
      {result.length ? (
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Företag</th>
              <th>Stad</th>
              <th>Roll</th>
            </tr>
          </thead>
          <tbody>
            {result.map(({ id, company, city, position }, i) => (
              <tr key={i}>
                <td>{id}</td>
                <td>{company.label}</td>
                <td>{city.label}</td>
                <td>{position.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Inga träffar.</p>
      )}
    </>
  )
}

export default OutputLayer
