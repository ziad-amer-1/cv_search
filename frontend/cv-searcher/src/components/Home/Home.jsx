import { useEffect } from "react"
import NavBar from "../NavBar/NavBar"
import { useNavigate } from "react-router-dom"
import Search from "../Search/Search"

function Home({
  isUserLoggedIn,
  setIsUserLoggedIn,
  numberOfFiles,
  setNumberOfFiles,
}) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isUserLoggedIn) {
      navigate("/login")
    }
  }, [])

  return (
    <>
      <NavBar
        numberOfFiles={numberOfFiles}
        setIsUserLoggedIn={setIsUserLoggedIn}
      />
      <Search setNumberOfFiles={setNumberOfFiles} />
    </>
  )
}

export default Home
