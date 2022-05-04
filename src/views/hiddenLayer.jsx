import { useEffect } from "react"
import { useAppContext, useGraph, useSearch } from "../hooks"

const HiddenLayer = () => {
  const [context, dispatch] = useAppContext()
  const { query, candidates } = context
  const graph = useGraph({ candidates })
  const search = useSearch({
    candidates,
    query,
    graph,
    filterArr: context[query.key.value].map(o => o.value),
  })

  useEffect(() => dispatch({ ...search, view: "output" }), [search, dispatch])

  return (
    <>
      <h1>Hidden layer</h1>
      <p>Searching...</p>
    </>
  )
}

export default HiddenLayer
