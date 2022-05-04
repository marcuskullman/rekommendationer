import { Suspense, lazy } from "react"
import { useAppContext } from "./hooks"
import InputLayer from "./views/inputLayer"

const HiddenLayer = lazy(() => import("./views/hiddenLayer"))
const OutputLayer = lazy(() => import("./views/outputLayer"))

const App = () => {
  const [{ view }] = useAppContext()

  const renderView = () => {
    switch (view) {
      case "output":
        return <OutputLayer />
      case "hidden":
        return <HiddenLayer />
      default:
        return <InputLayer />
    }
  }

  return <Suspense fallback={<p>Loading...</p>}>{renderView()}</Suspense>
}

export default App
