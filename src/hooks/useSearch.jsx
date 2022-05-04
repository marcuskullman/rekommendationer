const bfs = ({ query, graph }) => {
  const visited = new Set([query.value])
  const queue = [query.value]

  // eslint-disable-next-line
  search: while (queue.length) {
    const index = queue.shift()

    if (!graph.has(index)) continue

    const neighbors = graph.get(index).keys()

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)

        // Stop search at (not implemented in UI)
        // if (query.stopAt && query.stopAt === neighbor) break search

        queue.push(neighbor)
      }
    }
  }

  return visited
}

// eslint-disable-next-line
const dfs = ({ query, graph }) => {
  const visited = new Set([query.value])
  const helper = query => {
    const neighbors = graph.get(query).keys()

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)

        // Stop search at (not implemented in UI)
        // if (query.stopAt && query.stotAt === neighbor) break

        return helper(neighbor)
      }
    }
  }

  helper(query.value)

  return visited
}

export const useSearch = ({ query, graph, filterArr, candidates }) => {
  const isCompanySearch = query.key === "companies"

  // Search
  let searchResult = bfs({ query, graph })

  // Delete the current company form the search array
  isCompanySearch && searchResult.delete(query.value)

  // Filter
  searchResult = Array.from(searchResult).filter(res => filterArr.includes(res))

  // Positions
  let positions = query.positions?.map(position => position.value) || []

  // Generate Fibonacci sequence helper
  // The further away a matching candidate is, the less important the difference to the previous city is.
  const fib = n => {
    const phi = (1 + Math.sqrt(5)) / 2
    const asymp = Math.pow(phi, n) / Math.sqrt(5)

    return Math.round(asymp)
  }

  // For sorting
  let sumOfProducts = 0

  // Not used, but consider adding a grade to account for old data, un-complete profiles and so forth
  const sortByGrade = (a, b) => {
    if (a.grade && !b.grade) return -1
    if (b.grade && !a.grade) return 1
    if (a.grade && b.grade) {
      return a.grade > b.grade ? -1 : a.grade < b.grade ? 1 : 0
    }

    return 0
  }

  const filtered = candidates
    .filter(candidate => {
      let { company, position } = candidate

      if (!position) {
        // If a candidate doesn have position he/she will never be included in the result... Could be improved
        return null
      }

      company = company?.value
      position = position?.value

      if (isCompanySearch && query.value.value === company) {
        // Create array of position held within the current company
        if (!query.positions.length) positions.push(position)

        // Do not include people from within the same company
        if (!query.sameCompany) {
          return null
        }
      }

      // Do not include people that doesn't match the search result
      return searchResult.includes(
        isCompanySearch ? candidate.city?.value : company
      )
    })
    // Do not include people that doesn't have a role that currently exist in the current company
    // If specific position filter on that instead
    .filter(candidate => positions.includes(candidate.position?.value))

  // Create object from positions to prepare for weight calculation
  let counter = 0
  let positionsObject = query.c
    ? positions.reverse().reduce((acc, position, i) => {
        const value = (i % positions.length) + 1
        acc[position] = value
        counter += value

        return acc
      }, {})
    : positions.reduce((a, b) => {
        a[b] = (a[b] || 0) + 1

        return a
      }, {})

  const result = filtered
    .map(candidate => {
      const { position, city, company } = candidate

      // Add weight based on location (Fibonacci)
      const weight = fib(
        searchResult.length -
          searchResult.indexOf(isCompanySearch ? city.value : company.value) +
          1
      )

      // If given position(s) they are prioritized by order
      // If no given positions factor in most common positions at the company
      // TODO - Robin hood läget robinHoodMode
      let points =
        positionsObject[position.value] / (query.c ? counter : positions.length)

      // Calculate product
      const product = points * weight
      sumOfProducts += product
      candidate.product = product

      return candidate
    })
    .sort((a, b) =>
      a.product > b.product ? -1 : a.product < b.product ? 1 : sortByGrade(a, b)
    )

  // Mark below average
  const average =
    result.length > 2
      ? result.find(
          candidate => candidate.product < sumOfProducts / result.length
        )?.createdDate || null
      : null

  // Store result in global state
  return {
    result: result.slice(0, query.limit),
    average,
  }
}
