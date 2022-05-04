import { useAppContext } from "../hooks"

const OutputLayer = () => {
  const [{ result, average }, dispatch] = useAppContext()

  const getStatus = input =>
    input < 20 ? "red" : input < 80 ? "yellow" : "green"

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
            {result.map(
              ({ id, company, city, position, createdDate, grade }, i) => (
                <tr
                  key={i}
                  className={`
                    ${
                      // eslint-disable-next-line
                      id == average ? "average" : ""
                    } ${getStatus(grade || 0)}`}
                  style={{ "--width": `${Math.max(grade || 0, 0.25) + "%"}` }}
                >
                  <td>{id}</td>
                  <td>{company?.label || "-"}</td>
                  <td>{city?.label || "-"}</td>
                  <td>{position?.label || "-"}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      ) : (
        <p>Inga träffar. 😭</p>
      )}
    </>
  )
}

export default OutputLayer
