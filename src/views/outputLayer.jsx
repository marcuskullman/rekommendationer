import { useAppContext } from "../hooks"

const OutputLayer = () => {
  const [context, dispatch] = useAppContext()

  console.log(context)

  return (
    <>
      <h1>Output layer</h1>
      <button type="button" onClick={() => dispatch({ view: "input" })}>
        Ny sökning
      </button>
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
          <tr></tr>
        </tbody>
      </table>
    </>
  )
}

export default OutputLayer
