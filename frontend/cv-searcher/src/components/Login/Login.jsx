import { useEffect, useState } from "react"
import { login } from "../../api"
import "./Login.css"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function Login({ isUserLoggedIn, setIsUserLoggedIn }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate()

  const handleLoginSubmit = async (e) => {
    e.preventDefault()

    setIsLoading(true)
    const toastId = toast.info("Loading...", { autoClose: false })
    localStorage.setItem("current-username", username.trim())
    await login({ username: username.trim(), password: password.trim() })
      .then((res) => {
        setIsLoading(false)
        window.localStorage.setItem("token", res.data.token)
        axios.defaults.headers.common["Authorization"] =
          window.localStorage.getItem("token")
        setIsUserLoggedIn(true)
        navigate("/")
        toast.update(toastId, {
          render: "Logged in Successfully",
          type: toast.TYPE.SUCCESS,
          autoClose: 3000,
        })
        setTimeout(() => {
          toast.info(`Welcome Back ${username}`)
        }, 3000)
      })
      .catch((e) => {
        setIsLoading(false)
        toast.update(toastId, {
          render: e.response?.data?.message,
          type: toast.TYPE.ERROR,
          autoClose: 3000,
        })
      })
  }

  useEffect(() => {
    if (isUserLoggedIn) {
      navigate("/")
    }
  }, [])

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleLoginSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login
