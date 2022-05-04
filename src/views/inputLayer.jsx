import { useEffect, useState, useRef } from "react"
import { useAppContext, useGrade } from "../hooks"
import Select from "react-select"

const InputLayer = () => {
  const [context, dispatch] = useAppContext()
  const [input, setInput] = useState(context.query)
  const valueRef = useRef()

  // Bonus: adds a grade to each candidate to account for old data, un-complete profiles and so forth.
  // Data quality is key
  const Grade = candidates => useGrade({ candidates })

  useEffect(() => {
    const candidates = require("../dataset.json")
    const companies = []
    const cities = []
    const positions = []
    const uniqueCompanies = new Set()
    const uniqueCities = new Set()
    const uniquePositions = new Set()

    for (const { company, city, position } of candidates) {
      if (company) {
        if (!uniqueCompanies.has(company.value)) companies.push(company)
        uniqueCompanies.add(company.value)
      }

      if (city) {
        if (!uniqueCities.has(city.value)) cities.push(city)
        uniqueCities.add(city.value)
      }

      if (position) {
        if (!uniquePositions.has(position.value)) positions.push(position)
        uniquePositions.add(position.value)
      }
    }

    const sort = arr =>
      arr.sort((a, b) => (a.value > b.value ? 1 : b.value > a.value ? -1 : 0))

    dispatch({
      candidates: Grade(candidates),
      companies: sort(companies),
      cities: sort(cities),
      positions: sort(positions),
    })
  }, [dispatch])

  const handleChange = (selected, { name }) => {
    if (!selected && name !== "sameCompany") return

    const clone = {
      ...input,
      [name]: selected,
    }

    if (name === "key") {
      delete clone.value
      valueRef.current.clearValue()
    }

    setInput(clone)
  }

  return (
    <>
      <h1>Input layer</h1>
      <Select
        name="key"
        instanceId="key"
        defaultValue={input.key}
        options={context.keys}
        onChange={(selected, e) => handleChange(selected, e)}
        placeholder="Jag rekryterar..."
        isSearchable={false}
      />
      {input.key?.value === "companies" ? (
        <p>
          <label>
            <input
              type="checkbox"
              name="sameCompany"
              defaultChecked={input.sameCompany}
              onChange={e => handleChange(e.target.checked, e.target)}
            />{" "}
            Inkludera internkandidater
          </label>
        </p>
      ) : (
        <br />
      )}
      <Select
        ref={valueRef}
        name="value"
        instanceId="value"
        defaultValue={input.value}
        options={context[input.key?.value]}
        onChange={(selected, e) => handleChange(selected, e)}
        placeholder="Välj i listan"
        isDisabled={!input.key}
      />
      <br />
      <Select
        name="positions"
        instanceId="positions"
        defaultValue={input.positions}
        options={context.positions}
        onChange={(selected, e) => handleChange(selected, e)}
        placeholder="Sök bland yrkestitlar (flerval)"
        isMulti
        isClearable
      />
      {input.key?.value === "companies" ? (
        <p>Lämna rolltitelfältet tomt för automatisk sourcing*</p>
      ) : (
        <br />
      )}
      <button
        type="button"
        onClick={() => dispatch({ query: input, view: "hidden" })}
        disabled={
          !input.value ||
          (input.key?.value === "cities" && !input.positions?.length)
        }
      >
        Sök
      </button>
    </>
  )
}

export default InputLayer
