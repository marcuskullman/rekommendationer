const graph = (vertecies, edges) => {
  const graph = new Map()

  // Clear adjacency list (unused)
  // eslint-disable-next-line
  const clear = () => graph.clear()

  // Add vertex
  const addVertex = v => graph.set(v, new Map())

  // Add undirected edge
  const addEdge = (a, b, m) => {
    graph.has(a) && graph.get(a).set(b, m)
    graph.has(b) && graph.get(b).set(a, m)
  }

  // Add directed edge (unused)
  // eslint-disable-next-line
  const addDirectedEdge = (a, b, m) => graph.has(a) && graph.get(a).set(b, m)

  // Delete edge (unused)
  // eslint-disable-next-line
  const deleteEdge = (a, b) => {
    graph.get(a).delete(b)
    graph.get(b).delete(a)
  }

  // Delete vertex (unused)
  // eslint-disable-next-line
  const deleteVertex = v => {
    graph.forEach(edge => edge.delete(v))
    graph.delete(v)
  }

  vertecies.forEach(addVertex)
  edges.forEach(edge => addEdge(...edge))

  return graph
}

export const useGraph = ({ candidates }) => {
  // Create adjacency list
  const map = new Map()

  // Get all company-city references
  for (const { city, company } of candidates) {
    if (city) {
      if (!map.has(city.value)) map.set(city.value, [])
      if (company) map.get(city.value).push(company.value)
    }

    if (company) {
      if (!map.has(company.value)) map.set(company.value, [])
      if (city) map.get(company.value).push(city.value)
    }
  }

  // Sort arrays by count and remove duplicates
  const cost = Array.from(map.values()).map(obj => {
    const map = obj.reduce((a, b) => {
      a[b] = (a[b] || 0) + 1

      return a
    }, {})

    return Object.keys(map).sort((a, b) => map[b] - map[a])
  })

  // Only unique edges
  const test = (a, b) => {
    const test1 = JSON.stringify([a, b])
    const test2 = JSON.stringify([b, a])

    const exists = edges.some(edge => {
      const test = JSON.stringify([edge[0], edge[1]])

      return test === test1 || test === test2
    })

    if (!exists) edges.push([a, b, 0]) // 0 = weight
  }

  const edges = []
  const vertecies = Array.from(map.keys())

  vertecies.forEach((o1, i) => {
    const currentArr = cost[i]
    const o2 = currentArr[0]

    test(o1, o2)

    for (let i = 0; i < currentArr.length - 1; i++) {
      const a = currentArr[i]
      const b = currentArr[i + 1]

      test(a, b)
    }
  })

  // Create and return graph
  return graph(vertecies, edges)
}
