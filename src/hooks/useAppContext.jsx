import { createContext, useReducer, useContext, useEffect } from "react"

const Context = createContext()

const ContextProvider = ({ children }) => {
  const [context, dispatch] = useReducer(
    (context, action) => ({ ...context, ...action }),
    // Default state
    {
      query: {
        limit: 200,
      },
      keys: [
        {
          label: "Åt ett företag",
          value: "companies",
        },
        {
          label: "Med lokal utgångspunkt",
          value: "cities",
        },
      ],
    }
  )

  return (
    <Provider context={context} dispatch={dispatch}>
      {children}
    </Provider>
  )
}

const Provider = ({ children, dispatch, context }) => (
  <Context.Provider value={[context, dispatch]}>{children}</Context.Provider>
)

export const useAppContext = initialValue => {
  const hook = useContext(Context)

  useEffect(() => {
    if (initialValue) {
      const [context, dispatch] = hook
      dispatch({ ...context, ...initialValue })
    }
  }, [hook, initialValue])

  return hook
}

export default ContextProvider
