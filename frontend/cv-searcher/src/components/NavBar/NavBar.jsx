import "./NavBar.css"
import { Link, useNavigate } from "react-router-dom"

function NavBar({ setIsUserLoggedIn, numberOfFiles }) {
  const navigate = useNavigate()

  function handleLogout() {
    window.localStorage.removeItem("token")
    setIsUserLoggedIn(false)
    navigate("/login")
  }

  return (
    <header>
      <h2>
        {localStorage.getItem("current-username")
          ? localStorage.getItem("current-username")
          : "Search In CVs"}
      </h2>
      <div>Number of Files: {numberOfFiles}</div>
      <nav>
        <ul>
          <li>
            <Link to="/add-cv">Add new CV</Link>
          </li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </nav>
    </header>
  )
}

export default NavBar
