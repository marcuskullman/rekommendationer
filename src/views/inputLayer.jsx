import { useEffect, useState, useRef } from "react"
import { useAppContext } from "../hooks"
import Select from "react-select"

const InputLayer = () => {
  const [context, dispatch] = useAppContext()
  const [input, setInput] = useState(context.query)
  const valueRef = useRef()

  useEffect(() => {
    const candidates = require("../dataset.json")
    const companiesSet = new Set()
    const citiesSet = new Set()
    const positionsSet = new Set()

    for (const { company, city, position } of candidates) {
      if (company) companiesSet.add(company.value)
      if (city) citiesSet.add(city.value)
      if (position) positionsSet.add(position.value)
    }

    const formatForReactSelect = arr =>
      [...arr].sort().map(label => ({
        label,
        value: label.replace(/\s/g, "").toLowerCase().trim(),
      }))

    dispatch({
      candidates,
      companies: formatForReactSelect(companiesSet),
      cities: formatForReactSelect(citiesSet),
      positions: formatForReactSelect(positionsSet),
    })
  }, [dispatch])

  const handleChange = (selected, { name }) => {
    if (!selected) return

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
        name="positions"
        instanceId="positions"
        defaultValue={input.positions}
        options={context.positions}
        onChange={(selected, e) => handleChange(selected, e)}
        placeholder="Sök bland yrkestitlar (flerval)"
        isMulti
        isClearable
      />
      <p>Lämna tom för automatisk sourcing*</p>
      <br />
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
      <button
        type="button"
        onClick={() => dispatch({ query: input, view: "hidden" })}
        disabled={!input.value}
      >
        Sök
      </button>
    </>
  )
}

export default InputLayer
