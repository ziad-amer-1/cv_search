import { useEffect, useState } from "react"
import "./App.css"
import Login from "./components/Login/Login"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import Home from "./components/Home/Home"
import { ToastContainer } from "react-toastify"
import AddCV from "./components/AddCV/AddCV"

function App() {
  const navigate = useNavigate()
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [numberOfFiles, setNumberOfFiles] = useState(0)

  useEffect(() => {
    if (window.localStorage.getItem("token")) {
      setIsUserLoggedIn(true)
      navigate("/")
    } else {
      setIsUserLoggedIn(false)
      navigate("/login")
    }
  }, [])

  return (
    <>
      <ToastContainer position="top-left" />
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              isUserLoggedIn={isUserLoggedIn}
              setIsUserLoggedIn={setIsUserLoggedIn}
            />
          }
        />
        <Route
          path="/"
          element={
            <Home
              isUserLoggedIn={isUserLoggedIn}
              numberOfFiles={numberOfFiles}
              setNumberOfFiles={setNumberOfFiles}
              setIsUserLoggedIn={setIsUserLoggedIn}
            />
          }
        />
        <Route path="/add-cv" element={<AddCV />} />
        <Route
          path="*"
          element={<Navigate to={isUserLoggedIn ? "/" : "login"} replace />}
        />
      </Routes>
    </>
  )
}

export default App
