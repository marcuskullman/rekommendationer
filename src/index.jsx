import React from "react"
import ReactDOM from "react-dom/client"
import ContextProvider from "./hooks/useAppContext"
import App from "./App"
import "./index.css"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <ContextProvider>
    <App />
  </ContextProvider>
)
